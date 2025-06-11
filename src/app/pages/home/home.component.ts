import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  computed,
} from '@angular/core';
import { ModelDetectionService } from '../../core/services/modelDetection/model-detection.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  cameraActive = false;
  errorMessage = '';
  private mediaStream: MediaStream |null = null;
  aiModelActive = false;
  private readonly modelDetectionService = inject(ModelDetectionService);
  isCameraLoading = signal(false);
  aiLoadingOperation = signal<'start' | 'stop' | null>(null);
  



  async startCamera() {
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
    } catch (error) {
      this.errorMessage = 'Camera access denied or not available';
      this.cameraActive = false;
    } finally {
      this.isCameraLoading.set(false);
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream?.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
      this.videoElement.nativeElement.srcObject = null;
      this.cameraActive = false;
    }
  }

  startAIModel() {
    this.aiLoadingOperation.set('start');
    this.modelDetectionService.startModel().subscribe({
      next: (res) => {
        console.log(res);
        this.aiModelActive = true;
        this.errorMessage = '';
        this.aiLoadingOperation.set(null);
      },
      error: (err) => {
        console.log(err);
        this.aiModelActive = false;
        this.errorMessage = 'Failed to start AI model';
        this.aiLoadingOperation.set(null);
      },
    });
  }

  stopAIModel() {
    this.aiLoadingOperation.set('stop');
    this.modelDetectionService.stopModel().subscribe({
      next: (res) => {
        console.log(res);
        this.aiModelActive = false;
        this.errorMessage = '';
        this.aiLoadingOperation.set(null);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Failed to stop AI model';
        this.aiLoadingOperation.set(null);
      },
    });
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}