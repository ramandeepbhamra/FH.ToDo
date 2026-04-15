import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="auth-logo">
            <mat-icon>check_circle</mat-icon>
            <span>FH ToDo</span>
          </div>
          <mat-card-title>Create account</mat-card-title>
          <mat-card-subtitle>Fill in your details to get started</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
            <div class="name-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>First name</mat-label>
                <input matInput formControlName="firstName" autocomplete="given-name" />
                @if (form.controls.firstName.hasError('required') && form.controls.firstName.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Last name</mat-label>
                <input matInput formControlName="lastName" autocomplete="family-name" />
                @if (form.controls.lastName.hasError('required') && form.controls.lastName.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              <mat-icon matSuffix>email</mat-icon>
              @if (form.controls.email.hasError('required') && form.controls.email.touched) {
                <mat-error>Email is required</mat-error>
              } @else if (form.controls.email.hasError('email') && form.controls.email.touched) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="new-password"
              />
              <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())">
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.controls.password.hasError('required') && form.controls.password.touched) {
                <mat-error>Password is required</mat-error>
              } @else if (form.controls.password.hasError('minlength') && form.controls.password.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone (optional)</mat-label>
              <input matInput type="tel" formControlName="phoneNumber" autocomplete="tel" />
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <button
              mat-flat-button
              class="full-width submit-btn"
              type="submit"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20" />
              } @else {
                Create account
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <div class="card-footer">
            <span class="auth-link">
              Already have an account?
              <a mat-button routerLink="/auth/login">Sign in</a>
            </span>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--background);
    }

    .auth-container {
      width: 100%;
      max-width: 480px;
      padding: 16px;
    }

    .auth-card {
      padding: 8px 16px 16px;
    }

    .auth-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary);
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 8px;

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 8px;
    }

    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--error);
      background: color-mix(in srgb, var(--error) 10%, transparent);
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 0.875rem;
    }

    .submit-btn {
      height: 44px;
      margin-top: 4px;
    }

    .card-footer {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .auth-link {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phoneNumber: new FormControl<string | null>(null),
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, firstName, lastName, phoneNumber } = this.form.getRawValue();

    this.authService
      .register({
        email: email!,
        password: password!,
        firstName: firstName!,
        lastName: lastName!,
        phoneNumber: phoneNumber ?? null,
      })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
          this.isLoading.set(false);
        },
      });
  }
}
