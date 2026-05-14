import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

const API_URL = environment.apiUrl;
const TOKEN_KEY = 'ondjila_token';
const USER_KEY = 'ondjila_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  // ──────────────────────────────────────────────────────
  // Auth API calls
  // ──────────────────────────────────────────────────────

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.success) {
            this.persistSession(res.data.token, res.data.user);
          }
        })
      );
  }

  register(data: { name: string; email: string; password: string; password_confirmation: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data)
      .pipe(
        tap(res => {
          if (res.success) {
            this.persistSession(res.data.token, res.data.user);
          }
        })
      );
  }

  forgotPassword(email: string): Observable<{success: boolean, data: {message: string; reset_url?: string | null}}> {
    return this.http.post<{success: boolean, data: {message: string; reset_url?: string | null}}>(`${API_URL}/auth/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, password: string): Observable<{success: boolean, data: {message: string}}> {
    return this.http.post<{success: boolean, data: {message: string}}>(`${API_URL}/auth/reset-password`, { email, token, password });
  }

  updateProfile(data: { name: string; phone?: string | null; address?: string | null }): Observable<{success: boolean, data: {user: User; message: string}}> {
    return this.http.post<{success: boolean, data: {user: User; message: string}}>(`${API_URL}/auth/me/update`, data)
      .pipe(
        tap(res => {
          if (res.success && res.data?.user) {
            this.persistUser(res.data.user);
          }
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  // ──────────────────────────────────────────────────────
  // Helpers de estado (usados pelo Interceptor e Guard)
  // ──────────────────────────────────────────────────────

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // ──────────────────────────────────────────────────────
  // Persistência em localStorage
  // ──────────────────────────────────────────────────────

  private persistSession(token: string, user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private persistUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): User | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
