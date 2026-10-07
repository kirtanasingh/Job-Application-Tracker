import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('jobtrack_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data).pipe(
      tap(user => this.setSession(user))
    );
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => this.setSession(user))
    );
  }

  logout(): void {
    localStorage.removeItem('jobtrack_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(user: User): void {
    localStorage.setItem('jobtrack_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  getUserId(): number | null {
    const user = this.currentUser();
    if (!user) return null;
    return user.userId || (user as any).id || 1;
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? user.token : null;
  }
}
