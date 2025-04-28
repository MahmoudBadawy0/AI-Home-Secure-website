import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
// import { SecurityService } from '../services/security.service';

@Component({
  selector: 'app-theft-alert',
  templateUrl: './theft-alert.component.html',
  styleUrls: ['./theft-alert.component.css'],
  imports: [CommonModule],
})
export class TheftAlertComponent {
  lastSignal: boolean | null = null;
  isLoading = false;
  signalBeingSent: boolean | null = null;
  showConfirmation = false;
  statusMessage: {
    type: 'success' | 'error';
    text: string;
    icon: string;
  } | null = null;

  // constructor(private securityService: SecurityService) {}

  openConfirmation() {
    this.showConfirmation = true;
  }

  sendEmergencySignal() {
    this.sendSignal(true);
    this.showConfirmation = false;
  }

  sendSignal(theftDetected: boolean) {
    this.isLoading = true;
    this.signalBeingSent = theftDetected;
    this.statusMessage = null;

    // this.securityService.sendTheftSignal(theftDetected).subscribe({
    //   next: () => {
    //     this.lastSignal = theftDetected;
    //     this.isLoading = false;
    //     this.statusMessage = {
    //       type: 'success',
    //       text: theftDetected
    //         ? 'Theft reported successfully. Police have been notified.'
    //         : 'Alert cleared successfully.',
    //       icon: theftDetected ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'
    //     };
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //     this.statusMessage = {
    //       type: 'error',
    //       text: 'Failed to send signal. Please try again.',
    //       icon: 'fas fa-times-circle'
    //     };
    //   }
    // });
  }
}
