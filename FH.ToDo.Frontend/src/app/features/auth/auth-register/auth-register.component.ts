import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRegisterForm } from '../forms/auth-register.form';
import { passwordMatchValidator } from '../../../core/validators/password-match.validator';
import { PasswordMatchErrorStateMatcher } from '../../../core/matchers/password-match.matcher';
import { noWhitespaceValidator } from '../../../core/validators/no-whitespace.validator';
import { TrimOnBlurDirective } from '../../../core/directives/trim-on-blur.directive';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgxMaskDirective,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
    TrimOnBlurDirective,
  ],
})
export class AuthRegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup<AuthRegisterForm>(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl<string | null>(null, {
        validators: [Validators.maxLength(14)],
      }),
    },
    { validators: passwordMatchValidator() }
  );

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly confirmPasswordMatcher = new PasswordMatchErrorStateMatcher();

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, firstName, lastName, phoneNumber } = this.form.getRawValue();

    this.authService
      .register({ email, password, firstName, lastName, phoneNumber: phoneNumber ?? null })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
          this.isLoading.set(false);
        },
      });
  }
}
