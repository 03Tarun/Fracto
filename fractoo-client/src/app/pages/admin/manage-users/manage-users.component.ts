import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../services/models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <h1>Manage Users</h1>
      
      <button (click)="showForm = !showForm" class="btn-add">{{showForm ? 'Cancel' : '+ Add User'}}</button>

      <div *ngIf="showForm" class="form-card">
        <h3>{{editId ? 'Edit' : 'Add New'}} User</h3>
        <div class="form-grid">
          <div class="form-group"><label>Username</label><input [(ngModel)]="form.username" class="form-input"></div>
          <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="form.email" class="form-input"></div>
          <div class="form-group" *ngIf="!editId"><label>Password</label><input type="password" [(ngModel)]="form.password" class="form-input"></div>
          <div class="form-group">
            <label>Role</label>
            <select [(ngModel)]="form.role" class="form-input">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <button (click)="save()" class="btn-save">{{editId ? 'Update' : 'Create'}}</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{user.userId}}</td>
              <td>{{user.username}}</td>
              <td>{{user.email}}</td>
              <td><span class="role-badge" [class.admin]="user.role === 'Admin'">{{user.role}}</span></td>
              <td>{{user.createdAt | date:'mediumDate'}}</td>
              <td>
                <button (click)="edit(user)" class="btn-edit">Edit</button>
                <button *ngIf="user.role !== 'Admin'" (click)="deleteUser(user.userId)" class="btn-del">Delete</button>
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
    .btn-save { padding: 0.6rem 1.5rem; background: #22c55e; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-top: 1rem; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 16px; overflow: hidden; }
    th { background: #0f172a; padding: 1rem; text-align: left; font-weight: 600; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #334155; font-size: 0.9rem; }
    tr:hover td { background: rgba(56,189,248,0.05); }
    .role-badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background: rgba(56,189,248,0.15); color: #38bdf8; }
    .role-badge.admin { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .btn-edit { background: transparent; border: 1px solid #38bdf8; color: #38bdf8; padding: 0.3rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s; margin-right: 0.5rem; }
    .btn-edit:hover { background: #38bdf8; color: white; }
    .btn-del { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 0.3rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s; }
    .btn-del:hover { background: #ef4444; color: white; }
  `]
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  showForm = false;
  editId: number | null = null;
  form: any = { username: '', email: '', password: '', role: 'User' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void { this.apiService.getUsers().subscribe(u => this.users = u); }

  edit(user: User): void {
    this.editId = user.userId;
    this.form = { username: user.username, email: user.email, role: user.role };
    this.showForm = true;
  }

  save(): void {
    if (this.editId) {
      this.apiService.updateUser(this.editId, { username: this.form.username, email: this.form.email, role: this.form.role })
        .subscribe(() => { this.resetForm(); this.load(); });
    } else {
      this.apiService.createUser(this.form).subscribe({
        next: () => { this.resetForm(); this.load(); },
        error: (err) => alert(err.error?.message || 'Failed to create user.')
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Delete this user? This will cancel their appointments.')) {
      this.apiService.deleteUser(id).subscribe(() => this.load());
    }
  }

  resetForm(): void {
    this.showForm = false;
    this.editId = null;
    this.form = { username: '', email: '', password: '', role: 'User' };
  }
}
