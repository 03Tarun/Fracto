import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { DashboardStats } from '../../../services/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <h1>Admin Dashboard</h1>
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card blue">
          <div class="stat-value">{{stats.totalUsers}}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-value">{{stats.totalDoctors}}</div>
          <div class="stat-label">Total Doctors</div>
        </div>
        <div class="stat-card green">
          <div class="stat-value">{{stats.activeAppointments}}</div>
          <div class="stat-label">Active Appointments</div>
        </div>
        <div class="stat-card red">
          <div class="stat-value">{{stats.cancelledAppointments}}</div>
          <div class="stat-label">Cancelled</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-value">{{stats.totalAppointments}}</div>
          <div class="stat-label">Total Appointments</div>
        </div>
        <div class="stat-card teal">
          <div class="stat-value">{{stats.totalSpecializations}}</div>
          <div class="stat-label">Specializations</div>
        </div>
      </div>
      <div class="admin-nav">
        <a routerLink="/admin/users" class="admin-link-card">
          <span class="icon">👥</span>
          <span>Manage Users</span>
        </a>
        <a routerLink="/admin/doctors" class="admin-link-card">
          <span class="icon">🩺</span>
          <span>Manage Doctors</span>
        </a>
        <a routerLink="/admin/appointments" class="admin-link-card">
          <span class="icon">📅</span>
          <span>Manage Appointments</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1100px; margin: 0 auto; padding: 2rem; color: #e2e8f0; }
    .admin-page h1 { font-size: 1.8rem; margin-bottom: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
    .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.5rem; text-align: center; transition: transform 0.3s; }
    .stat-card:hover { transform: translateY(-3px); }
    .stat-value { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.25rem; }
    .stat-label { color: #64748b; font-size: 0.85rem; font-weight: 500; }
    .stat-card.blue .stat-value { color: #38bdf8; }
    .stat-card.purple .stat-value { color: #818cf8; }
    .stat-card.green .stat-value { color: #22c55e; }
    .stat-card.red .stat-value { color: #ef4444; }
    .stat-card.orange .stat-value { color: #f97316; }
    .stat-card.teal .stat-value { color: #14b8a6; }
    .admin-nav { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .admin-link-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; text-align: center; text-decoration: none; color: #e2e8f0; font-weight: 600; font-size: 1.1rem; transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
    .admin-link-card:hover { border-color: #38bdf8; transform: translateY(-3px); box-shadow: 0 8px 30px rgba(56,189,248,0.15); }
    .icon { font-size: 2.5rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getDashboardStats().subscribe(s => this.stats = s);
  }
}
