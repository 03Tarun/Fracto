import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Fractoo account</p>
        </div>
        <form (ngSubmit)="login()" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>
          <div *ngIf="error" class="error-msg">{{error}}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{loading ? 'Signing in...' : 'Sign In'}}
          </button>
        </form>
        <p class="auth-footer">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      padding: 2rem;
    }
    .auth-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 24px;
      padding: 3rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h1 { color: #e2e8f0; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .auth-header p { color: #64748b; }
    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { color: #94a3b8; font-weight: 500; font-size: 0.9rem; }
    .form-group input {
      padding: 0.85rem 1rem;
      border-radius: 12px;
      border: 1px solid #334155;
      background: #0f172a;
      color: #e2e8f0;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .form-group input:focus { border-color: #38bdf8; }
    .btn-primary {
      padding: 0.85rem;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      margin-top: 0.5rem;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(56,189,248,0.3);
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .error-msg {
      color: #ef4444;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }
    .auth-footer {
      text-align: center;
      color: #64748b;
      margin-top: 1.5rem;
    }
    .auth-footer a { color: #38bdf8; text-decoration: none; font-weight: 500; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.loading = true;
    this.error = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([res.role === 'Admin' ? '/admin' : '/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
