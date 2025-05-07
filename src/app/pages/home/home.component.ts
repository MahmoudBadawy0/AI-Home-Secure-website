import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ModelDetectionService } from '../../core/services/modelDetection/model-detection.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  cameraActive = false;
  errorMessage = '';
  private mediaStream: MediaStream | null = null;
  aiModelActive = false;
  private readonly modelDetectionService = inject(ModelDetectionService);
  isAILoading = signal(false);
  isCameraLoading = signal(false);

  async toggleCamera() {
    if (this.isCameraLoading()) return;

    if (this.cameraActive) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
    this.isCameraLoading.set(false);
  }

  private async startCamera() {
    this.isCameraLoading.set(true);
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
      this.cameraActive = true;
      this.errorMessage = '';
      this.isCameraLoading.set(false);
    } catch (error) {
      this.errorMessage = 'Camera access denied or not available';
      this.cameraActive = false;
      this.isCameraLoading.set(false);
    }
  }

  private stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
      this.videoElement.nativeElement.srcObject = null;
      this.cameraActive = false;
    }
  }

  private async startAIModel() {
    this.isAILoading.set(true);
    this.modelDetectionService.startModel().subscribe({
      next: (res) => {
        console.log(res);
        this.isAILoading.set(false);
        this.aiModelActive = true;
        this.errorMessage = '';
      },
      error: (err) => {
        console.log(err);
        this.isAILoading.set(false);
        this.aiModelActive = false;
        this.errorMessage = 'Failed to start AI model';
      },
    });
  }

  private async stopAIModel() {
    this.isAILoading.set(true);
    this.modelDetectionService.stopModel().subscribe({
      next: (res) => {
        console.log(res);
        this.isAILoading.set(false);
        this.aiModelActive = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.log(err);
        this.isAILoading.set(false);
        this.errorMessage = 'Failed to stop AI model';
      },
    });
  }

  async toggleAIModel() {
    if (this.isAILoading()) return;

    if (this.aiModelActive) {
      await this.stopAIModel();
    } else {
      await this.startAIModel();
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
