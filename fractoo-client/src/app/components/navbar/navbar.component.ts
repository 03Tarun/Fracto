import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { AuthResponse } from '../../services/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🩺</span>
          <span class="logo-text">Fractoo</span>
        </a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/search" routerLinkActive="active">Find Doctors</a>

          <ng-container *ngIf="user">
            <a routerLink="/my-appointments" routerLinkActive="active">My Appointments</a>
            <a *ngIf="user.role === 'Admin'" routerLink="/admin" routerLinkActive="active" class="admin-link">Admin</a>
            <div class="user-menu">
              <img *ngIf="userAvatar" [src]="'http://localhost:5207' + userAvatar" class="avatar-img" alt="Profile">
              <span class="user-name">{{user.username}}</span>
              
              <input type="file" #profileInput (change)="uploadProfile($event)" style="display:none" accept="image/*">
              <button (click)="profileInput.click()" class="btn-logout" style="border-color: #38bdf8; color: #38bdf8;">Pic</button>
              
              <button (click)="logout()" class="btn-logout">Logout</button>
            </div>
          </ng-container>

          <ng-container *ngIf="!user">
            <a routerLink="/login" routerLinkActive="active" class="btn-login">Login</a>
            <a routerLink="/register" routerLinkActive="active" class="btn-register">Register</a>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .logo-icon { font-size: 1.8rem; }
    .logo-text {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
      font-size: 0.95rem;
    }
    .nav-links a:hover, .nav-links a.active { color: #38bdf8; }
    .admin-link { color: #fbbf24 !important; }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: 0.5rem;
      padding-left: 1.5rem;
      border-left: 1px solid #334155;
    }
    .user-name {
      color: #e2e8f0;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }
    .btn-logout:hover {
      background: #ef4444;
      color: white;
    }
    .avatar-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #38bdf8;
    }
    .btn-login {
      border: 1px solid #38bdf8;
      padding: 0.4rem 1.2rem;
      border-radius: 8px;
      color: #38bdf8 !important;
      transition: all 0.3s;
    }
    .btn-login:hover { background: rgba(56,189,248,0.1); }
    .btn-register {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      padding: 0.4rem 1.2rem;
      border-radius: 8px;
      color: white !important;
      transition: transform 0.3s;
    }
    .btn-register:hover { transform: translateY(-2px); }
  `]
})
export class NavbarComponent implements OnInit {
  user: AuthResponse | null = null;
  userAvatar: string | null = null; // store path here for now

  constructor(private authService: AuthService, private uploadService: UploadService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  uploadProfile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadUserProfileImage(file).subscribe({
        next: (res) => {
          this.userAvatar = res.profileImagePath;
          alert('Profile image updated successfully!');
        },
        error: (err) => alert('Upload failed: ' + (err.error?.message || err.message))
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
