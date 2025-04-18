import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  imports: [FormsModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  image = signal<string | null>(null);
  userName = signal<string>('');
  uploadedImage = signal<File | undefined>(undefined);
  cameraActive = signal(false);
  errorMessage = '';
  private mediaStream: MediaStream | null = null;

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private readonly http: HttpClient = inject(HttpClient);

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
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Camera access denied or not available';
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

  // Modified capture method
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

  //handle validation
  hasValidSubmission(): boolean {
    return !!this.image() && this.userName().trim().length > 2;
  }

  // Modified clearAll
  clearAll() {
    this.image.set(null);
    this.uploadedImage.set(undefined);
    this.userName.set('');
    this.stopCamera();
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Implement upload logic
  uploadImage() {
    if (!this.uploadedImage() || !this.userName().trim()) return;

    const formData = new FormData();
    formData.append('image', this.uploadedImage()!);
    formData.append('userName', this.userName().trim());

    this.http.post('YOUR_BACKEND_URL', formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.clearAll();
      },
      error: (err) => {
        console.error('Upload failed:', err);
        // Handle error
      },
    });
  }
}






