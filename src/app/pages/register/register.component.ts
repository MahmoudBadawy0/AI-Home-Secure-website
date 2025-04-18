import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  isLoading = signal(false);
  msgError = signal('');

  ngOnInit(): void {
    this.initForm();
  }

  registerForm!: FormGroup;

  initForm() {
    this.registerForm = this.formBuilder.group({
      name: [
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
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    });
  }

  submitRegister() {
    if (this.registerForm.valid) {
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
      this.registerForm.markAllAsTouched();
    }
  }
}
