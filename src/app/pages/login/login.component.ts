import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  isLoading = signal(false);
  msgError = signal('');

  ngOnInit(): void {
    this.initForm();
  }

  logInForm!: FormGroup;

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
      // this.authService.sendRegisterForm(this.registerForm.value).subscribe({
      //   next: (res) => {
      //     if (res.message === 'success') {
      //       setTimeout(() => {
      //         this.router.navigate(['/login']);
      //       }, 500);
      //     }
      //     this.isLoading = false;
      //   },
      //   error: (err: HttpErrorResponse) => {
      //     this.msgError = err.error.message;
      //     this.isLoading = false;
      //   },
      // });
    } else {
      this.logInForm.markAllAsTouched();
    }
  }
}
