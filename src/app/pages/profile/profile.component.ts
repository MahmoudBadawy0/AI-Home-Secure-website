import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from '../../core/services/authService/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  personalInfoForm: FormGroup;
  securityForm: FormGroup;
  profilePreview: string | null = null;
  isLoading = signal(false);

  private readonly authServiceService = inject(AuthServiceService);
  private readonly toastrService = inject(ToastrService);

  navigationTabs = [
    { id: 'personal', label: 'Personal Information', icon: 'fas fa-user' },
    { id: 'security', label: 'Security Settings', icon: 'fas fa-shield-alt' },
  ];

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            ),
          ],
        ],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
      },
      { updateOn: 'submit' }
    );

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
    this.setFormValuesFromToken();
  }

  private setFormValuesFromToken(): void {
    this.authServiceService.tokenDecode();

    if (this.authServiceService.decodedToken) {
      this.personalInfoForm.patchValue({
        name: this.authServiceService.decodedToken.unique_name || '',
        email: this.authServiceService.decodedToken.email || '',
        phone: this.authServiceService.decodedToken.phone || '',
      });
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  sidebarOpen = false;
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      console.log('Personal Info Form:', this.personalInfoForm.value);
    }
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.isLoading.set(true);
      this.authServiceService
        .changePassword(this.securityForm.value)
        .subscribe({
          next: (res) => {
            console.log('res', res);
            this.isLoading.set(false);
            this.toastrService.success(res, 'Success');
            setTimeout(() => {
              this.securityForm.reset();
            }, 500);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Login error', err);
            this.toastrService.error('failed. Please try again.', 'Error');
            this.isLoading.set(false);
          },
        });
    } else {
      this.securityForm.markAllAsTouched();
    }
  }
}
