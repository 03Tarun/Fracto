import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { ApiService } from '../../services/api.service';
import { Doctor, Specialization } from '../../services/models';

@Component({
  selector: 'app-doctor-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="search-page">
      <div class="filters">
        <h2>Find Doctors</h2>
        <div class="filter-row">
          <select [(ngModel)]="selectedCity" (change)="search()" class="filter-input">
            <option value="">All Cities</option>
            <option *ngFor="let city of cities" [value]="city">{{city}}</option>
          </select>
          <select [(ngModel)]="selectedSpec" (change)="search()" class="filter-input">
            <option value="">All Specializations</option>
            <option *ngFor="let spec of specializations" [value]="spec.specializationId">{{spec.specializationName}}</option>
          </select>
          <select [(ngModel)]="minRating" (change)="search()" class="filter-input">
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
      </div>

      <div class="results">
        <p class="result-count" *ngIf="!loading">{{doctors.length}} doctors found</p>
        <div *ngIf="loading" class="loading">Loading doctors...</div>
        <div class="doctor-grid">
          <a *ngFor="let doc of doctors" [routerLink]="['/doctor', doc.doctorId]" class="doctor-card">
            <div class="doc-avatar">{{doc.name.charAt(0)}}</div>
            <div class="doc-info">
              <h3>{{doc.name}}</h3>
              <span class="doc-spec">{{doc.specializationName}}</span>
              <div class="doc-meta">
                <span>📍 {{doc.city}}</span>
                <span>⭐ {{doc.rating}}</span>
                <span>🏥 {{doc.experienceYears}} yrs</span>
              </div>
              <div class="doc-fee">₹{{doc.consultationFee}}</div>
            </div>
          </a>
        </div>
        <div *ngIf="!loading && doctors.length === 0" class="no-results">
          <p>No doctors found matching your criteria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-page { max-width: 1200px; margin: 0 auto; padding: 2rem; color: #e2e8f0; }
    .filters { margin-bottom: 2rem; }
    .filters h2 { font-size: 1.8rem; margin-bottom: 1rem; }
    .filter-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-input {
      padding: 0.7rem 1rem; border-radius: 12px; border: 1px solid #334155;
      background: #1e293b; color: #e2e8f0; font-size: 0.9rem; min-width: 180px; outline: none;
    }
    .filter-input:focus { border-color: #38bdf8; }
    .result-count { color: #64748b; margin-bottom: 1rem; }
    .loading { text-align: center; padding: 3rem; color: #64748b; }
    .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.25rem; }
    .doctor-card {
      background: #1e293b; border: 1px solid #334155; border-radius: 16px;
      padding: 1.5rem; display: flex; gap: 1rem; text-decoration: none; color: #e2e8f0;
      transition: all 0.3s; cursor: pointer;
    }
    .doctor-card:hover { transform: translateY(-3px); border-color: #38bdf8; box-shadow: 0 8px 30px rgba(56,189,248,0.15); }
    .doc-avatar {
      width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center;
      justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0;
      background: linear-gradient(135deg, #38bdf8, #818cf8); color: white;
    }
    .doc-info { flex: 1; }
    .doc-info h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
    .doc-spec { color: #38bdf8; font-size: 0.85rem; font-weight: 500; }
    .doc-meta { display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.85rem; color: #94a3b8; }
    .doc-fee { margin-top: 0.5rem; font-weight: 700; color: #22c55e; font-size: 1.1rem; }
    .no-results { text-align: center; padding: 3rem; color: #64748b; }
  `]
})
export class DoctorSearchComponent implements OnInit {
  doctors: Doctor[] = [];
  cities: string[] = [];
  specializations: Specialization[] = [];
  selectedCity = '';
  selectedSpec: number | '' = '';
  minRating: number | '' = '';
  loading = false;

  constructor(
    private doctorService: DoctorService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.doctorService.getCities().subscribe(c => this.cities = c);
    this.apiService.getSpecializations().subscribe(s => this.specializations = s);

    this.route.queryParams.subscribe(params => {
      if (params['city']) this.selectedCity = params['city'];
      if (params['specializationId']) this.selectedSpec = +params['specializationId'];
      this.search();
    });
  }

  search(): void {
    this.loading = true;
    const specId = this.selectedSpec ? +this.selectedSpec : undefined;
    const rating = this.minRating ? +this.minRating : undefined;
    this.doctorService.searchDoctors(this.selectedCity || undefined, specId, rating).subscribe({
      next: (docs) => { this.doctors = docs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
