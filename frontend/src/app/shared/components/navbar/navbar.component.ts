import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { JobApplicationService } from '../../../core/services/job-application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">JobTrack</span>
            <span class="brand-subtitle">Application Tracker</span>
          </div>
        </div>

        <div class="nav-links" *ngIf="authService.isLoggedIn()">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/applications" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Applications</span>
          </a>
        </div>

        <div class="nav-right">
          <div class="nav-status">
            <span class="status-indicator" [class.connected]="apiConnected" [class.disconnected]="!apiConnected"></span>
            <span class="status-text">{{ apiStatusText }}</span>
          </div>

          <div class="user-menu" *ngIf="authService.currentUser() as user; else authButtons">
            <div class="user-avatar">{{ user.fullName.substring(0, 2).toUpperCase() }}</div>
            <span class="user-name">{{ user.fullName }}</span>
            <button class="logout-btn" (click)="authService.logout()" title="Sign Out">
              🚪 Logout
            </button>
          </div>

          <ng-template #authButtons>
            <div class="auth-btn-group">
              <a routerLink="/login" class="nav-auth-btn nav-btn-outline">Sign In</a>
              <a routerLink="/register" class="nav-auth-btn nav-btn-primary">Sign Up</a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(30, 41, 59, 0.6);
      padding: 0.3rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.1rem;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-item.active {
      color: #ffffff;
      background: #6366f1;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nav-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      background: rgba(30, 41, 59, 0.8);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.8rem;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-indicator.connected {
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .status-indicator.disconnected {
      background: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
    }
    .status-text {
      color: #cbd5e1;
      font-weight: 500;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(30, 41, 59, 0.6);
      padding: 0.35rem 0.85rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-name {
      color: #f8fafc;
      font-size: 0.88rem;
      font-weight: 600;
    }
    .logout-btn {
      background: rgba(244, 63, 94, 0.15);
      color: #f87171;
      border: none;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      margin-left: 0.4rem;
      transition: all 0.2s ease;
    }
    .logout-btn:hover {
      background: rgba(244, 63, 94, 0.25);
    }
    .auth-btn-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-auth-btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .nav-btn-outline {
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .nav-btn-outline:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }
    .nav-btn-primary {
      background: #6366f1;
      color: white;
    }
    .nav-btn-primary:hover {
      background: #4f46e5;
    }
  `]
})
export class NavbarComponent implements OnInit {
  apiConnected = false;
  apiStatusText = 'Checking API...';

  constructor(
    private jobService: JobApplicationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.jobService.getApiStatus().subscribe({
      next: (res) => {
        if (res && res.status === 'Online') {
          this.apiConnected = true;
          this.apiStatusText = 'API Connected';
        } else {
          this.apiConnected = false;
          this.apiStatusText = 'API Standby';
        }
      },
      error: () => {
        this.apiConnected = false;
        this.apiStatusText = 'API Offline';
      }
    });
  }
}
