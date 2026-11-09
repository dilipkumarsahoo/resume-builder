import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SavedResume {
  id: number;
  userId: number;
  title: string;
  template: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resume`;

  getResumes(): Observable<{ status: string; data: SavedResume[] }> {
    return this.http.get<{ status: string; data: SavedResume[] }>(this.apiUrl);
  }

  getResumeById(id: number): Observable<{ status: string; data: SavedResume }> {
    return this.http.get<{ status: string; data: SavedResume }>(`${this.apiUrl}/${id}`);
  }

  saveResume(payload: { id?: number; title?: string; template?: string; content: any }): Observable<{ status: string; message: string; data: SavedResume }> {
    return this.http.post<{ status: string; message: string; data: SavedResume }>(this.apiUrl, payload);
  }

  deleteResume(id: number): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/${id}`);
  }
}

