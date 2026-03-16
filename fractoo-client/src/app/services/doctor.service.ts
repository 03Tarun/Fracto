import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, TimeSlot } from './models';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = 'http://localhost:5207/api';

  constructor(private http: HttpClient) {}

  searchDoctors(city?: string, specializationId?: number, minRating?: number): Observable<Doctor[]> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (specializationId) params = params.set('specializationId', specializationId.toString());
    if (minRating) params = params.set('minRating', minRating.toString());
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`, { params });
  }

  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctors/${id}`);
  }

  getTimeSlots(doctorId: number, date: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/doctors/${doctorId}/timeslots`, {
      params: { date }
    });
  }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/doctors/cities`);
  }

  createDoctor(data: any): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/doctors`, data);
  }

  updateDoctor(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/doctors/${id}`, data);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/doctors/${id}`);
  }
}
