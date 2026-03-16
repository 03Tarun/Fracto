import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Doctor, Rating } from '../../services/models';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="detail-page" *ngIf="doctor">
      <div class="doctor-header">
        <div class="doc-avatar">{{doctor.name.charAt(0)}}</div>
        <div class="doc-info">
          <h1>{{doctor.name}}</h1>
          <span class="spec-badge">{{doctor.specializationName}}</span>
          <div class="doc-meta">
            <span>📍 {{doctor.city}}</span>
            <span>⭐ {{doctor.rating}} / 5</span>
            <span>🏥 {{doctor.experienceYears}} years exp</span>
            <span>💰 ₹{{doctor.consultationFee}}</span>
          </div>
          <p class="doc-about" *ngIf="doctor.about">{{doctor.about}}</p>
          <div class="doc-contact">
            <span *ngIf="doctor.email">📧 {{doctor.email}}</span>
            <span *ngIf="doctor.phone">📞 {{doctor.phone}}</span>
          </div>
        </div>
      </div>

      <div class="booking-section" *ngIf="authService.isLoggedIn()">
        <h2>Book Appointment</h2>
        <div class="booking-row">
          <div class="form-group">
            <label>Select Date</label>
            <input type="date" [(ngModel)]="selectedDate" (change)="loadSlots()" [min]="minDate" class="form-input">
          </div>
        </div>
        <div class="slots-grid" *ngIf="timeSlots.length > 0">
          <button *ngFor="let slot of timeSlots"
            [class.available]="slot.isAvailable"
            [class.taken]="!slot.isAvailable"
            [class.selected]="selectedSlot === slot.timeSlot"
            (click)="slot.isAvailable && selectSlot(slot.timeSlot)"
            [disabled]="!slot.isAvailable">
            {{slot.timeSlot}}
          </button>
        </div>
        <button *ngIf="selectedSlot" (click)="bookAppointment()" class="btn-book" [disabled]="booking">
          {{booking ? 'Booking...' : 'Confirm Booking'}}
        </button>
        <div *ngIf="bookingMsg" class="success-msg">{{bookingMsg}}</div>
        <div *ngIf="bookingErr" class="error-msg">{{bookingErr}}</div>
      </div>
      <div class="login-prompt" *ngIf="!authService.isLoggedIn()">
        <p>Please <a routerLink="/login">login</a> to book an appointment.</p>
      </div>

      <div class="ratings-section">
        <h2>Reviews ({{ratings.length}})</h2>
        <div *ngIf="authService.isLoggedIn() && !hasRated" class="add-review">
          <h3>Leave a Review</h3>
          <div class="star-input">
            <span *ngFor="let s of [1,2,3,4,5]" (click)="newRating = s" [class.filled]="s <= newRating" class="star">★</span>
          </div>
          <textarea [(ngModel)]="newReview" placeholder="Write your review (optional)" class="form-input textarea-input"></textarea>
          <button (click)="submitRating()" class="btn-submit">Submit Review</button>
        </div>
        <div *ngFor="let r of ratings" class="review-card">
          <div class="review-header">
            <strong>{{r.username}}</strong>
            <span class="review-stars">{{'★'.repeat(r.ratingValue)}}{{'☆'.repeat(5 - r.ratingValue)}}</span>
          </div>
          <p *ngIf="r.review">{{r.review}}</p>
          <small>{{r.createdAt | date:'mediumDate'}}</small>
        </div>
        <p *ngIf="ratings.length === 0" class="no-reviews">No reviews yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { max-width: 900px; margin: 0 auto; padding: 2rem; color: #e2e8f0; }
    .doctor-header { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 2rem; display: flex; gap: 1.5rem; margin-bottom: 2rem; }
    .doc-avatar { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; flex-shrink: 0; background: linear-gradient(135deg, #38bdf8, #818cf8); color: white; }
    .doc-info h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .spec-badge { background: rgba(56,189,248,0.15); color: #38bdf8; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
    .doc-meta { display: flex; gap: 1.25rem; margin-top: 0.75rem; font-size: 0.9rem; color: #94a3b8; flex-wrap: wrap; }
    .doc-about { margin-top: 0.75rem; color: #94a3b8; line-height: 1.6; }
    .doc-contact { margin-top: 0.5rem; display: flex; gap: 1.5rem; color: #64748b; font-size: 0.85rem; }
    .booking-section, .ratings-section { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; }
    .booking-section h2, .ratings-section h2 { font-size: 1.3rem; margin-bottom: 1rem; }
    .booking-row { margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { color: #94a3b8; font-weight: 500; font-size: 0.9rem; }
    .form-input { padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-size: 0.95rem; outline: none; transition: border-color 0.3s; max-width: 300px; }
    .form-input:focus { border-color: #38bdf8; }
    .textarea-input { max-width: 100%; min-height: 80px; resize: vertical; font-family: inherit; }
    .slots-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
    .slots-grid button { padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .slots-grid button.available:hover { border-color: #38bdf8; background: rgba(56,189,248,0.1); }
    .slots-grid button.selected { background: #38bdf8; color: white; border-color: #38bdf8; }
    .slots-grid button.taken { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
    .btn-book, .btn-submit { padding: 0.75rem 2rem; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: transform 0.3s; margin-top: 0.5rem; }
    .btn-book:hover, .btn-submit:hover { transform: translateY(-2px); }
    .btn-book:disabled { opacity: 0.6; cursor: not-allowed; }
    .success-msg { color: #22c55e; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); padding: 0.75rem; border-radius: 8px; margin-top: 0.75rem; }
    .error-msg { color: #ef4444; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); padding: 0.75rem; border-radius: 8px; margin-top: 0.75rem; }
    .login-prompt { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 2rem; text-align: center; margin-bottom: 2rem; }
    .login-prompt a { color: #38bdf8; text-decoration: none; font-weight: 600; }
    .star-input { margin-bottom: 0.75rem; }
    .star { font-size: 1.8rem; cursor: pointer; color: #334155; transition: color 0.2s; }
    .star.filled { color: #fbbf24; }
    .add-review { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #334155; }
    .add-review h3 { margin-bottom: 0.75rem; }
    .review-card { padding: 1rem 0; border-bottom: 1px solid #0f172a; }
    .review-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem; }
    .review-stars { color: #fbbf24; }
    .review-card p { color: #94a3b8; margin: 0.25rem 0; }
    .review-card small { color: #475569; }
    .no-reviews { color: #64748b; text-align: center; padding: 1rem; }
  `]
})
export class DoctorDetailComponent implements OnInit {
  doctor: Doctor | null = null;
  ratings: Rating[] = [];
  timeSlots: any[] = [];
  selectedDate = '';
  selectedSlot = '';
  booking = false;
  bookingMsg = '';
  bookingErr = '';
  newRating = 0;
  newReview = '';
  hasRated = false;
  minDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private apiService: ApiService,
    public authService: AuthService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.doctorService.getDoctor(id).subscribe(d => this.doctor = d);
    this.loadRatings(id);
  }

  loadRatings(doctorId: number): void {
    this.apiService.getDoctorRatings(doctorId).subscribe(ratings => {
      this.ratings = ratings;
      const user = this.authService.getCurrentUser();
      if (user) this.hasRated = ratings.some(r => r.userId === user.userId);
    });
  }

  loadSlots(): void {
    if (!this.doctor || !this.selectedDate) return;
    this.selectedSlot = '';
    this.doctorService.getTimeSlots(this.doctor.doctorId, this.selectedDate).subscribe(s => this.timeSlots = s);
  }

  selectSlot(slot: string): void { this.selectedSlot = slot; }

  bookAppointment(): void {
    if (!this.doctor || !this.selectedSlot) return;
    this.booking = true;
    this.bookingMsg = '';
    this.bookingErr = '';
    this.appointmentService.bookAppointment({
      doctorId: this.doctor.doctorId,
      appointmentDate: this.selectedDate,
      timeSlot: this.selectedSlot
    }).subscribe({
      next: () => {
        this.booking = false;
        this.bookingMsg = 'Appointment booked successfully! ✅';
        this.loadSlots();
      },
      error: (err) => {
        this.booking = false;
        this.bookingErr = err.error?.message || 'Booking failed. Please try again.';
      }
    });
  }

  submitRating(): void {
    if (!this.doctor || this.newRating === 0) return;
    this.apiService.addRating({
      doctorId: this.doctor.doctorId,
      ratingValue: this.newRating,
      review: this.newReview || undefined
    }).subscribe({
      next: () => {
        this.hasRated = true;
        this.loadRatings(this.doctor!.doctorId);
        this.doctorService.getDoctor(this.doctor!.doctorId).subscribe(d => this.doctor = d);
      }
    });
  }
}
