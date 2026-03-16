import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialization, Rating, User, DashboardStats } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:5207/api';

  constructor(private http: HttpClient) {}

  // Specializations
  getSpecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.apiUrl}/specializations`);
  }

  createSpecialization(data: { specializationName: string }): Observable<Specialization> {
    return this.http.post<Specialization>(`${this.apiUrl}/specializations`, data);
  }

  // Ratings
  addRating(data: { doctorId: number; ratingValue: number; review?: string }): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/ratings`, data);
  }

  getDoctorRatings(doctorId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/ratings/doctor/${doctorId}`);
  }

  // Admin
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  createUser(data: { username: string; email: string; password?: string; role: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, data);
  }

  updateUser(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/stats`);
  }
}
