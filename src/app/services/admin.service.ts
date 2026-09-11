import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalPayments: number;
  successfulPaymentsCount: number;
  totalRevenueInr: number;
  conversionRate: string;
  recentUsers: any[];
  recentPayments: any[];
  totalContacts?: number;
  unreadContacts?: number;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    payments: number;
  };
}

export interface AdminPayment {
  id: number;
  merchantOrderId: string;
  phonepeTransactionId?: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  paymentMethod?: string;
  mobileNumber?: string;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    role: string;
    isPro: boolean;
  };
}

export interface AdminContact {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/admin';

  currentAdmin = signal<any>(null);
  activeTab = signal<'overview' | 'users' | 'payments' | 'contacts' | 'settings'>('overview');

  constructor() {
    this.loadAdminFromStorage();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getAdminToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getStats(): Observable<{ status: string; data: AdminStats }> {
    return this.http.get<{ status: string; data: AdminStats }>(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  getUsers(params?: { search?: string; isPro?: string; role?: string; page?: number; limit?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.isPro !== undefined && params?.isPro !== '') httpParams = httpParams.set('isPro', params.isPro);
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<any>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  toggleUserPro(userId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}/toggle-pro`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPayments(params?: { status?: string; page?: number; limit?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.status && params.status !== 'ALL') httpParams = httpParams.set('status', params.status);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<any>(`${this.apiUrl}/payments`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  getContacts(params?: { status?: string; page?: number; limit?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.status && params.status !== 'ALL') httpParams = httpParams.set('status', params.status);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<any>(`${this.apiUrl}/contacts`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  updateContactStatus(id: number, status: 'UNREAD' | 'READ' | 'REPLIED'): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/contacts/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/contacts/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdminToken(): string | null {
    return this.authService.getToken();
  }

  loadAdminFromStorage() {
    const user = this.authService.getUser();
    if (user && user.role === 'ADMIN') {
      this.currentAdmin.set(user);
    } else {
      this.currentAdmin.set(null);
    }
  }

  isAdminLoggedIn(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.currentAdmin.set(null);
    this.router.navigate(['/login']);
  }
}
