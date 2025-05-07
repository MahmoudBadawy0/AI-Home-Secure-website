import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../core/services/authService/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authServiceService = inject(AuthServiceService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  msgError = signal('');

  ngOnInit(): void {
    this.initForm();
  }

  registerForm!: FormGroup;

  initForm() {
    this.registerForm = this.formBuilder.group({
      userName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
        ],
      ],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^\+201[0125][0-9]{8}$/)],
      ],
    });
  }

  submitRegister() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authServiceService
        .sendRegisterForm(this.registerForm.value)
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 500);
            console.log('res', res);
            this.isLoading.set(false);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Registration error', err);
            let errorMessage = 'Registration failed. Please try again.';

            if (err.status === 0) {
              errorMessage =
                'Unable to connect to server. Please check your connection.';
            } else if (err.status === 400) {
              errorMessage = err.error?.message || 'Invalid registration data.';
            } else if (err.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            }

            this.msgError.set(errorMessage);
            this.isLoading.set(false);
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
