import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../services/models';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <h1>My Appointments</h1>
      <div *ngIf="loading" class="loading">Loading appointments...</div>
      <div *ngIf="!loading && appointments.length === 0" class="empty">
        <p>You haven't booked any appointments yet.</p>
        <a routerLink="/search" class="btn-primary">Find Doctors</a>
      </div>
      <div class="appointments-list">
        <div *ngFor="let apt of appointments" class="apt-card" [class.cancelled]="apt.status === 'Cancelled'">
          <div class="apt-left">
            <div class="apt-avatar">{{apt.doctorName.charAt(0)}}</div>
            <div class="apt-info">
              <h3>{{apt.doctorName}}</h3>
              <span class="apt-spec">{{apt.specializationName}}</span>
              <div class="apt-time">
                <span>📅 {{apt.appointmentDate | date:'mediumDate'}}</span>
                <span>⏰ {{apt.timeSlot}}</span>
              </div>
            </div>
          </div>
          <div class="apt-right">
            <span class="status" [class]="'status-' + apt.status.toLowerCase()">{{apt.status}}</span>
            <button *ngIf="apt.status !== 'Cancelled'" (click)="cancel(apt.appointmentId)" class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; padding: 2rem; color: #e2e8f0; }
    .page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
    .loading, .empty { text-align: center; padding: 3rem; color: #64748b; }
    .btn-primary { display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #38bdf8, #818cf8); color: white; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 1rem; }
    .appointments-list { display: flex; flex-direction: column; gap: 1rem; }
    .apt-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; }
    .apt-card:hover { border-color: #38bdf8; }
    .apt-card.cancelled { opacity: 0.6; }
    .apt-left { display: flex; gap: 1rem; align-items: center; }
    .apt-avatar { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; background: linear-gradient(135deg, #38bdf8, #818cf8); color: white; }
    .apt-info h3 { font-size: 1.05rem; margin-bottom: 0.2rem; }
    .apt-spec { color: #38bdf8; font-size: 0.8rem; font-weight: 500; }
    .apt-time { display: flex; gap: 1rem; margin-top: 0.4rem; font-size: 0.85rem; color: #94a3b8; }
    .apt-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
    .status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .status-confirmed { background: rgba(34,197,94,0.15); color: #22c55e; }
    .status-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .status-cancelled { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-cancel { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 0.35rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s; }
    .btn-cancel:hover { background: #ef4444; color: white; }
  `]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cancel(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe(() => this.load());
    }
  }
}
