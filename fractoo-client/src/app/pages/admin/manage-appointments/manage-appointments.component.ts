import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../services/models';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <h1>Manage Appointments</h1>
      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let apt of appointments" [class.cancelled]="apt.status === 'Cancelled'">
              <td>{{apt.appointmentId}}</td>
              <td>{{apt.username}}</td>
              <td>{{apt.doctorName}}</td>
              <td>{{apt.appointmentDate | date:'mediumDate'}}</td>
              <td>{{apt.timeSlot}}</td>
              <td><span class="status" [class]="'status-' + apt.status.toLowerCase()">{{apt.status}}</span></td>
              <td>
                <button *ngIf="apt.status === 'Pending'" (click)="confirm(apt.appointmentId)" class="btn-confirm">Confirm</button>
                <button *ngIf="apt.status !== 'Cancelled'" (click)="cancel(apt.appointmentId)" class="btn-cancel">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { max-width: 1100px; margin: 0 auto; padding: 2rem; color: #e2e8f0; }
    .admin-page h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 16px; overflow: hidden; }
    th { background: #0f172a; padding: 0.85rem; text-align: left; font-weight: 600; color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 0.75rem 0.85rem; border-bottom: 1px solid #334155; font-size: 0.88rem; }
    tr:hover td { background: rgba(56,189,248,0.05); }
    tr.cancelled td { opacity: 0.5; }
    .status { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .status-confirmed { background: rgba(34,197,94,0.15); color: #22c55e; }
    .status-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .status-cancelled { background: rgba(239,68,68,0.15); color: #ef4444; }
    .btn-confirm { background: transparent; border: 1px solid #22c55e; color: #22c55e; padding: 0.25rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-right: 0.4rem; }
    .btn-cancel { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 0.25rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
    .btn-confirm:hover { background: #22c55e; color: white; }
    .btn-cancel:hover { background: #ef4444; color: white; }
  `]
})
export class ManageAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.appointmentService.getAllAppointments().subscribe(a => this.appointments = a); }

  confirm(id: number): void { this.appointmentService.confirmAppointment(id).subscribe(() => this.load()); }

  cancel(id: number): void {
    if (confirm('Cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe(() => this.load());
    }
  }
}
