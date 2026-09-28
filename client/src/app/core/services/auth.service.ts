import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = 'mayhem_token';

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromToken());
  currentUser$ = this.currentUserSubject.asObservable();

  register(username: string, avatar: User['avatar']) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, { username, avatar }).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  login(username: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, { username }).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private handleAuthResponse(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    this.currentUserSubject.next(res.user);
  }

  private loadUserFromToken(): User | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        _id: payload.userId,
        username: payload.username,
        avatar: payload.avatar || 'bull',
        stats: { gamesPlayed: 0, wins: 0, totalEarnings: 0 },
        createdAt: ''
      };
    } catch {
      return null;
    }
  }
}
