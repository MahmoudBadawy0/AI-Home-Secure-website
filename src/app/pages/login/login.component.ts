import { HttpErrorResponse } from '@angular/common/http';
import { AuthServiceService } from './../../core/services/authService/auth-service.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authServiceService = inject(AuthServiceService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  msgError = signal('');
  logInForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.logInForm = this.formBuilder.group({
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
    });
  }

  submitLogin() {
    if (this.logInForm.valid) {
      this.isLoading.set(true);
      this.authServiceService.sendLoginForm(this.logInForm.value).subscribe({
        next: (res) => {
          console.log('res', res);
          setTimeout(() => {
            localStorage.setItem('token', res.access_token);
            this.authServiceService.tokenDecode();
            this.router.navigate(['/home']);
          }, 500);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login error', err);
          this.isLoading.set(false);
          let errorMessage = 'Login failed. Please try again.';
          if (err.status === 0) {
            errorMessage =
              'Unable to connect to server. Please check your connection.';
          } else if (err.status === 401) {
            errorMessage = 'Invalid email or password.';
          } else if (err.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          this.msgError.set(errorMessage);
        },
      });
    } else {
      this.logInForm.markAllAsTouched();
    }
  }
}
