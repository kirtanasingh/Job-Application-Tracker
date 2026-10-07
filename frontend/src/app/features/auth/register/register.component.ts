import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="16" y1="11" x2="22" y2="11"></line>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p>Sign up to track your job search and save applications</p>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          ⚠️ {{ errorMessage }}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input 
              type="text" 
              formControlName="fullName" 
              placeholder="e.g. Jane Doe" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('fullName')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('fullName')">
              Full Name is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="you@example.com" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
              Please enter a valid email address.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              formControlName="password" 
              placeholder="Min. 6 characters" 
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
              Password must be at least 6 characters.
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign In</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 75vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .auth-card {
      background: rgba(30, 41, 59, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      width: 100%;
      max-width: 440px;
      padding: 2.25rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .auth-logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
    }
    .auth-header h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .auth-header p {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-top: 0.35rem;
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #cbd5e1;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: #f8fafc;
      font-size: 0.92rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }
    .form-control.is-invalid {
      border-color: #f87171;
    }
    .invalid-feedback {
      font-size: 0.8rem;
      color: #f87171;
    }
    .btn-block {
      width: 100%;
      padding: 0.8rem;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }
    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      background: #4f46e5;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.75rem;
      font-size: 0.88rem;
      color: #94a3b8;
    }
    .auth-footer a {
      color: #818cf8;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
