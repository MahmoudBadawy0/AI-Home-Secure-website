// theft-alert.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { EmergencyTriggerService } from '../../core/services/emergencyTrigger/emergency-trigger.service';

@Component({
  selector: 'app-theft-alert',
  standalone: true,
  templateUrl: './theft-alert.component.html',
  styleUrls: ['./theft-alert.component.css'],
  imports: [CommonModule],
})
export class TheftAlertComponent {
  // Theft signals
  theftStartCallLoading = signal(false);
  theftStopCallLoading = signal(false);
  
  // Fire signals
  fireStartCallLoading = signal(false);
  fireStopCallLoading = signal(false);
  
  // Gas signals
  gasStartCallLoading = signal(false);
  gasStopCallLoading = signal(false);
  
  // Modal control
  showConfirmation = signal(false);
  emergencyType: 'theft' | 'fire' | 'gas' | null = null;

  statusMessage: {
    type: 'success' | 'error' | 'theft' | 'warning';
    text: string;
    icon: string;
  } | null = null;

  private readonly emergencyService = inject(EmergencyTriggerService);

  // Get current loading state for modal button
  getLoadingState(): boolean {
    if (!this.emergencyType) return false;
    return this[`${this.emergencyType}StartCallLoading`]();
  }

  openConfirmation(type: 'theft' | 'fire' | 'gas') {
    this.emergencyType = type;
    this.showConfirmation.set(true);
  }

  sendEmergencySignal() {
    if (!this.emergencyType) return;
    
    switch (this.emergencyType) {
      case 'theft': 
        this.startTheftCall();
        break;
      case 'fire':
        this.startFireCall();
        break;
      case 'gas':
        this.startGasCall();
        break;
    }
  }

  // Theft Emergency Methods
  startTheftCall() {
    this.theftStartCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.startCall().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Theft reported successfully. Police have been notified.',
          icon: 'fas fa-shield-alt',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to report theft. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => {
        this.theftStartCallLoading.set(false);
        this.showConfirmation.set(false);
      }
    });
  }

  stopTheftCall() {
    this.theftStopCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.stopCall().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Theft alert cleared successfully.',
          icon: 'fas fa-check-circle',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to clear theft alert. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => this.theftStopCallLoading.set(false)
    });
  }

  // Fire Emergency Methods
  startFireCall() {
    this.fireStartCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.startCallFire().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Fire reported successfully. Emergency services notified.',
          icon: 'fas fa-fire-extinguisher',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to report fire. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => {
        this.fireStartCallLoading.set(false);
        this.showConfirmation.set(false);
      }
    });
  }

  stopFireCall() {
    this.fireStopCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.stopCallFire().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Fire alert cleared successfully.',
          icon: 'fas fa-check-circle',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to clear fire alert. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => this.fireStopCallLoading.set(false)
    });
  }

  // Gas Emergency Methods
  startGasCall() {
    this.gasStartCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.startCallGas().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Gas leak reported successfully. Emergency services notified.',
          icon: 'fas fa-wind',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to report gas leak. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => {
        this.gasStartCallLoading.set(false);
        this.showConfirmation.set(false);
      }
    });
  }

  stopGasCall() {
    this.gasStopCallLoading.set(true);
    this.statusMessage = null;

    this.emergencyService.stopCallGas().subscribe({
      next: () => {
        this.statusMessage = {
          type: 'success',
          text: 'Gas alert cleared successfully.',
          icon: 'fas fa-check-circle',
        };
      },
      error: () => {
        this.statusMessage = {
          type: 'error',
          text: 'Failed to clear gas alert. Please try again.',
          icon: 'fas fa-times-circle',
        };
      },
      complete: () => this.gasStopCallLoading.set(false)
    });
  }
}