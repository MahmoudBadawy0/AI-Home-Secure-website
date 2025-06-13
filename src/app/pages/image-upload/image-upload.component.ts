import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UploadImageService } from '../../core/services/uploadImage/upload-image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-upload',
  imports: [FormsModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  image = signal<string | null>(null);

  isLoading = signal(false);

  userName = signal<string>('');
  uploadedImage = signal<File | undefined>(undefined);

  cameraActive = signal(false);
  errorMessage = signal<string | null>(null); 

  familyRoles = signal<string[]>(['Father', 'Mother', 'Son', 'Daughter']); 
  selectedFamilyRole = signal<string>(''); 

  private mediaStream: MediaStream | null = null;

  private readonly uploadService = inject(UploadImageService);
  private readonly toastrService = inject(ToastrService);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedImage.set(input.files[0]);

      const reader = new FileReader();
      reader.onload = () => {
        this.image.set(reader.result as string);
      };
      reader.readAsDataURL(this.uploadedImage()!);
    }
  }

  private async startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
      });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.cameraActive.set(true);
      this.errorMessage.set(null);
    } catch (error) {
      this.errorMessage.set('Camera access denied or not available');
      this.cameraActive.set(false);
    }
  }
  private stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
      this.videoElement.nativeElement.srcObject = null;
      this.cameraActive.set(false);
    }
  }

  async toggleCamera() {
    if (this.cameraActive()) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  capture() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured-image.jpg', {
          type: 'image/jpeg',
        });
        this.uploadedImage.set(file);
        this.image.set(URL.createObjectURL(blob));
        this.stopCamera();
      }
    }, 'image/jpeg');
  }

  hasValidSubmission(): boolean {
    return !!this.image() && this.userName().trim().length > 2 && !!this.selectedFamilyRole();
  }


  clearAll() {
    this.image.set(null);
    this.uploadedImage.set(undefined);
    this.userName.set('');
    this.selectedFamilyRole.set('');
    this.stopCamera();
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  

  uploadImage() {
    if (!this.hasValidSubmission()) return;

    const formData = new FormData();
    formData.append('image', this.uploadedImage()!);
    formData.append('memberName', this.userName().trim());
    formData.append('relation', this.selectedFamilyRole()); 

    this.isLoading.set(true);

    this.uploadService.uploadImage(formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.toastrService.success('image sent successful', 'Success');
        this.isLoading.set(false);
        this.clearAll();
      },
      error: (err) => {
        this.toastrService.error('failed. Please try again.', 'Error');
        this.isLoading.set(false);
        console.error('Upload failed:', err);
        this.errorMessage.set('Upload failed. Please try again.');
      },
    });
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.image()) {
      URL.revokeObjectURL(this.image()!);
    }
  }
}
