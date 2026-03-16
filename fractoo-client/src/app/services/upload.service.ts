import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  // Optional: fallback to localhost directly if environment isn't set
  private baseUrl = 'http://localhost:5207/api';

  uploadUserProfileImage(file: File): Observable<{profileImagePath: string}> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{profileImagePath: string}>(`${this.baseUrl}/auth/upload-profile-image`, formData);
  }

  uploadDoctorProfileImage(doctorId: number, file: File): Observable<{profileImagePath: string}> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{profileImagePath: string}>(`${this.baseUrl}/doctors/${doctorId}/upload-profile-image`, formData);
  }
}
