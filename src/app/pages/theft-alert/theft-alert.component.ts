import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { EmergencyTriggerService } from '../../core/services/emergencyTrigger/emergency-trigger.service';
// import { SecurityService } from '../services/security.service';

@Component({
  selector: 'app-theft-alert',
  templateUrl: './theft-alert.component.html',
  styleUrls: ['./theft-alert.component.css'],
  imports: [CommonModule],
})
export class TheftAlertComponent {
  startCallLoading = signal(false);
  stopCallLoading = signal(false);
  showConfirmation = signal(false);;

  statusMessage: {
    type: 'success' | 'error';
    text: string;
    icon: string;
  } | null = null;

  private readonly emergencyService = inject(EmergencyTriggerService);

  openConfirmation() {
    this.showConfirmation.set(true);
  }

  startCall() {
    this.startCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.startCall().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Theft reported successfully. Police have been notified.',
          icon: 'fas fa-phone-alt',
        };
        this.startCallLoading.set(false);
        this.showConfirmation.set(false);
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to start call. Please try again.',
          icon: 'fas fa-times-circle',
        };
        this.startCallLoading.set(false);
        this.showConfirmation.set(false);
      },
    });
  }

  stopCall() {
    this.stopCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.stopCall().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Call stopped successfully.',
          icon: 'fas fa-phone-alt',
        };
        this.stopCallLoading.set(false);
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to stop call. Please try again.',
          icon: 'fas fa-times-circle',
        };
        this.stopCallLoading.set(false);
      },
    });
  }

  sendEmergencySignal() {
    this.startCall();
    this.showConfirmation.set(false);
  }

}
