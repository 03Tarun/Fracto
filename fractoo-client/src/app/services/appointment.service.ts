import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from './models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:5207/api/appointments';

  constructor(private http: HttpClient) {}

  bookAppointment(data: { doctorId: number; appointmentDate: string; timeSlot: string }): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all`);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }

  confirmAppointment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/confirm`, {});
  }
}
