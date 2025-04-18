import { Component, ElementRef, ViewChild } from '@angular/core';

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

  async toggleCamera() {
    if (this.cameraActive) {
      this.stopCamera();
    } else {
      await this.startCamera();
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
      this.cameraActive = true;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Camera access denied or not available';
      this.cameraActive = false;
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


  ngOnDestroy() {
    this.stopCamera();
  }


  
}
