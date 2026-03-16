import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { ApiService } from '../../services/api.service';
import { Specialization } from '../../services/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Book Your <span class="highlight">Doctor Appointment</span> Online</h1>
          <p>Find the best doctors in your city, choose your preferred time slot, and book instantly.</p>
          <div class="search-box">
            <select [(ngModel)]="selectedCity" class="select-input">
              <option value="">Select City</option>
              <option *ngFor="let city of cities" [value]="city">{{city}}</option>
            </select>
            <select [(ngModel)]="selectedSpec" class="select-input">
              <option value="">All Specializations</option>
              <option *ngFor="let spec of specializations" [value]="spec.specializationId">{{spec.specializationName}}</option>
            </select>
            <a [routerLink]="['/search']" [queryParams]="{city: selectedCity, specializationId: selectedSpec}" class="btn-search">
              Search Doctors
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card card-1">🏥 500+ Doctors</div>
          <div class="floating-card card-2">⭐ Top Rated</div>
          <div class="floating-card card-3">📅 Instant Booking</div>
        </div>
      </section>

      <!-- Specializations -->
      <section class="section">
        <h2 class="section-title">Browse by Specialization</h2>
        <div class="spec-grid">
          <a *ngFor="let spec of specializations" [routerLink]="['/search']"
            [queryParams]="{specializationId: spec.specializationId}" class="spec-card">
            <span class="spec-icon">{{getSpecIcon(spec.specializationName)}}</span>
            <h3>{{spec.specializationName}}</h3>
            <p>{{spec.doctorCount}} doctors</p>
          </a>
        </div>
      </section>

      <!-- Cities -->
      <section class="section section-dark">
        <h2 class="section-title">Available Cities</h2>
        <div class="city-grid">
          <a *ngFor="let city of cities" [routerLink]="['/search']"
            [queryParams]="{city: city}" class="city-card">
            <span class="city-icon">📍</span>
            <span>{{city}}</span>
          </a>
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <h2 class="section-title">Why Choose Fractoo?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Search & Filter</h3>
            <p>Find doctors by city, specialization, and ratings</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3>Real-time Slots</h3>
            <p>See available time slots and book instantly</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✅</div>
            <h3>Instant Confirmation</h3>
            <p>Get immediate booking confirmation</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Secure Platform</h3>
            <p>Your data is safe with JWT authentication</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home { color: #e2e8f0; }
    .hero {
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      padding: 5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      min-height: 70vh;
    }
    .hero-content { max-width: 600px; }
    .hero-content h1 {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    .highlight {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-content p {
      color: #94a3b8;
      font-size: 1.15rem;
      margin-bottom: 2rem;
    }
    .search-box {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .select-input {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #e2e8f0;
      font-size: 0.95rem;
      min-width: 180px;
      outline: none;
    }
    .select-input:focus { border-color: #38bdf8; }
    .btn-search {
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(56,189,248,0.3);
    }
    .hero-visual { position: relative; width: 300px; height: 300px; }
    .floating-card {
      position: absolute;
      background: rgba(30,41,59,0.9);
      border: 1px solid #334155;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      font-weight: 600;
      animation: float 3s ease-in-out infinite;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .card-1 { top: 0; left: 0; animation-delay: 0s; }
    .card-2 { top: 40%; right: 0; animation-delay: 1s; }
    .card-3 { bottom: 0; left: 20%; animation-delay: 2s; }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    .section {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-dark {
      background: #0f172a;
      max-width: 100%;
      padding: 4rem calc((100% - 1200px) / 2 + 2rem);
    }
    .section-title {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2.5rem;
      font-weight: 700;
    }
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }
    .spec-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      text-decoration: none;
      color: #e2e8f0;
      transition: all 0.3s;
    }
    .spec-card:hover {
      transform: translateY(-5px);
      border-color: #38bdf8;
      box-shadow: 0 8px 30px rgba(56,189,248,0.15);
    }
    .spec-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
    .spec-card h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .spec-card p { color: #64748b; font-size: 0.85rem; }
    .city-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
    .city-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      color: #e2e8f0;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }
    .city-card:hover {
      background: #38bdf8;
      color: white;
      transform: scale(1.05);
    }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .feature-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-card h3 { margin-bottom: 0.5rem; }
    .feature-card p { color: #94a3b8; font-size: 0.9rem; }
  `]
})
export class HomeComponent implements OnInit {
  cities: string[] = [];
  specializations: Specialization[] = [];
  selectedCity = '';
  selectedSpec = '';

  constructor(private doctorService: DoctorService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.doctorService.getCities().subscribe(c => this.cities = c);
    this.apiService.getSpecializations().subscribe(s => this.specializations = s);
  }

  getSpecIcon(name: string): string {
    const icons: Record<string, string> = {
      'Cardiologist': '❤️', 'Dermatologist': '🧴', 'Neurologist': '🧠',
      'Orthopedic': '🦴', 'Pediatrician': '👶', 'Psychiatrist': '🧘',
      'General Physician': '🩺', 'ENT Specialist': '👂', 'Ophthalmologist': '👁️',
      'Dentist': '🦷'
    };
    return icons[name] || '🏥';
  }
}
