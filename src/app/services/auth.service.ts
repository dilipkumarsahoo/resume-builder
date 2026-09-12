import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  isPro?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  currentUser = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  saveUser(user: AuthUser) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('glowcv_user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }

  getUser(): AuthUser | null {
    if (this.currentUser()) {
      return this.currentUser();
    }
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('glowcv_user');
      if (data) {
        try {
          const user = JSON.parse(data);
          this.currentUser.set(user);
          return user;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  loadUserFromStorage() {
    this.getUser();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && user.role === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('glowcv_user');
      localStorage.removeItem('glowcv_admin_token');
      localStorage.removeItem('glowcv_admin_data');
      localStorage.removeItem('glowcv_is_pro');
    }
    this.currentUser.set(null);
  }
}

