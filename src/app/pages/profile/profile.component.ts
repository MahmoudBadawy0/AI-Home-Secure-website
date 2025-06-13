import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../../core/services/authService/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IProfile } from '../../core/interfaces/iprofile';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  profile = signal<IProfile | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  securityForm: FormGroup;
  sidebarOpen = signal(false);

  private readonly authServiceService = inject(AuthServiceService);
  private readonly toastrService = inject(ToastrService);
  private readonly fb = inject(FormBuilder);

  navigationTabs = [
    { id: 'personal', label: 'Personal Information', icon: 'fas fa-user' },
    { id: 'security', label: 'Security Settings', icon: 'fas fa-shield-alt' },
  ];

  constructor() {
    this.securityForm = this.fb.group(
      {
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
          ],
        ],
      },
      { updateOn: 'submit' }
    );
  }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.authServiceService.getProfile().subscribe({
      next: (res) => {
        console.log(res);
        this.profile.set(res);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch profile:', err);
        this.errorMessage.set('Unable to load profile. Please try again later.');
        this.isLoading.set(false);
        // Fallback to fake data
        this.profile.set({
          image: 'https://picsum.photos/seed/picsum/200/300',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+201012345678',
        });
      },
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    if (this.sidebarOpen()) {
      this.toggleSidebar();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.isLoading.set(true);
      this.authServiceService
        .changePassword(this.securityForm.value)
        .subscribe({
          next: (res) => {
            this.toastrService.success(res, 'Success');
            this.isLoading.set(false);
            setTimeout(() => {
              this.securityForm.reset();
            }, 500);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Change password error:', err);
            this.toastrService.error('Failed. Please try again.', 'Error');
            this.isLoading.set(false);
          },
        });
    } else {
      this.securityForm.markAllAsTouched();
    }
  }
}