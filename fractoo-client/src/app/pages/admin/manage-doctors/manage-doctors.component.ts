import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { ApiService } from '../../../services/api.service';
import { UploadService } from '../../../services/upload.service';
import { Doctor, Specialization } from '../../../services/models';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <h1>Manage Doctors</h1>

      <button (click)="showForm = !showForm" class="btn-add">{{showForm ? 'Cancel' : '+ Add Doctor'}}</button>

      <div *ngIf="showForm" class="form-card">
        <h3>{{editId ? 'Edit' : 'Add New'}} Doctor</h3>
        <div class="form-grid">
          <div class="form-group"><label>Name</label><input [(ngModel)]="form.name" class="form-input"></div>
          <div class="form-group">
            <label>Specialization</label>
            <select [(ngModel)]="form.specializationId" class="form-input">
              <option *ngFor="let s of specializations" [value]="s.specializationId">{{s.specializationName}}</option>
            </select>
          </div>
          <div class="form-group"><label>City</label><input [(ngModel)]="form.city" class="form-input"></div>
          <div class="form-group"><label>Email</label><input [(ngModel)]="form.email" class="form-input"></div>
          <div class="form-group"><label>Phone</label><input [(ngModel)]="form.phone" class="form-input"></div>
          <div class="form-group"><label>Experience (years)</label><input type="number" [(ngModel)]="form.experienceYears" class="form-input"></div>
          <div class="form-group"><label>Consultation Fee (₹)</label><input type="number" [(ngModel)]="form.consultationFee" class="form-input"></div>
          <div class="form-group full-width"><label>About</label><textarea [(ngModel)]="form.about" class="form-input textarea"></textarea></div>
        </div>
        <button (click)="save()" class="btn-save">{{editId ? 'Update' : 'Create'}}</button>
      </div>

      <div class="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>City</th><th>Rating</th><th>Fee</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let doc of doctors">
              <td>{{doc.doctorId}}</td>
              <td>{{doc.name}}</td>
              <td>{{doc.specializationName}}</td>
              <td>{{doc.city}}</td>
              <td>⭐ {{doc.rating}}</td>
              <td>₹{{doc.consultationFee}}</td>
              <td>
                <input type="file" #fileInput (change)="uploadImage($event, doc.doctorId)" style="display:none" accept="image/*">
                <button (click)="fileInput.click()" class="btn-edit">Pic</button>
                <button (click)="edit(doc)" class="btn-edit">Edit</button>
                <button (click)="del(doc.doctorId)" class="btn-del">Delete</button>
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
    .btn-add { padding: 0.6rem 1.5rem; background: linear-gradient(135deg, #38bdf8, #818cf8); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
    .form-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .form-card h3 { margin-bottom: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { color: #94a3b8; font-size: 0.85rem; font-weight: 500; }
    .form-input { padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; outline: none; }
    .form-input:focus { border-color: #38bdf8; }
    .full-width { grid-column: 1 / -1; }
    .textarea { min-height: 60px; resize: vertical; font-family: inherit; }
    .btn-save { padding: 0.6rem 1.5rem; background: #22c55e; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: 1rem; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 16px; overflow: hidden; }
    th { background: #0f172a; padding: 0.85rem; text-align: left; font-weight: 600; color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 0.75rem 0.85rem; border-bottom: 1px solid #334155; font-size: 0.88rem; }
    tr:hover td { background: rgba(56,189,248,0.05); }
    .btn-edit { background: transparent; border: 1px solid #38bdf8; color: #38bdf8; padding: 0.25rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; margin-right: 0.4rem; }
    .btn-del { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 0.25rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
    .btn-edit:hover { background: #38bdf8; color: white; }
    .btn-del:hover { background: #ef4444; color: white; }
  `]
})
export class ManageDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  specializations: Specialization[] = [];
  showForm = false;
  editId: number | null = null;
  form: any = { name: '', specializationId: 1, city: '', email: '', phone: '', about: '', experienceYears: 0, consultationFee: 0 };

  constructor(private doctorService: DoctorService, private apiService: ApiService, private uploadService: UploadService) {}

  ngOnInit(): void {
    this.load();
    this.apiService.getSpecializations().subscribe(s => this.specializations = s);
  }

  load(): void { this.doctorService.searchDoctors().subscribe(d => this.doctors = d); }

  edit(doc: Doctor): void {
    this.editId = doc.doctorId;
    this.form = { name: doc.name, specializationId: doc.specializationId, city: doc.city, email: doc.email, phone: doc.phone, about: doc.about, experienceYears: doc.experienceYears, consultationFee: doc.consultationFee };
    this.showForm = true;
  }

  save(): void {
    if (this.editId) {
      this.doctorService.updateDoctor(this.editId, this.form).subscribe(() => { this.resetForm(); this.load(); });
    } else {
      this.doctorService.createDoctor(this.form).subscribe(() => { this.resetForm(); this.load(); });
    }
  }

  del(id: number): void {
    if (confirm('Delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({ next: () => this.load(), error: (err) => alert(err.error?.message || 'Cannot delete.') });
    }
  }

  uploadImage(event: any, doctorId: number): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadDoctorProfileImage(doctorId, file).subscribe({
        next: (res) => {
          alert('Image uploaded successfully: ' + res.profileImagePath);
          this.load();
        },
        error: (err) => alert('Upload failed: ' + (err.error?.message || err.message))
      });
    }
  }

  resetForm(): void {
    this.editId = null;
    this.showForm = false;
    this.form = { name: '', specializationId: 1, city: '', email: '', phone: '', about: '', experienceYears: 0, consultationFee: 0 };
  }
}
