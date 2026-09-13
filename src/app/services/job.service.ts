import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface TrackedJob {
  id?: number;
  userId?: number;
  position: string;
  company: string;
  status: 'Bookmarked' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | string;
  dateSaved: string;
  dateApplied?: string | null;
  type?: string;
  resume?: string;
  notes?: string;
  location?: string;
  salary?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/jobs';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getJobs(): Observable<{ success: boolean; data: TrackedJob[] }> {
    return this.http.get<{ success: boolean; data: TrackedJob[] }>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addJob(job: Partial<TrackedJob>): Observable<{ success: boolean; message: string; data: TrackedJob }> {
    return this.http.post<{ success: boolean; message: string; data: TrackedJob }>(this.apiUrl, job, {
      headers: this.getAuthHeaders()
    });
  }

  updateJob(id: number, job: Partial<TrackedJob>): Observable<{ success: boolean; message: string; data: TrackedJob }> {
    return this.http.put<{ success: boolean; message: string; data: TrackedJob }>(`${this.apiUrl}/${id}`, job, {
      headers: this.getAuthHeaders()
    });
  }

  deleteJob(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
