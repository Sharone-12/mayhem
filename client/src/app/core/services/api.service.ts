import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { World, Company, Portfolio } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // World endpoints
  createWorld(data: { name: string; settings: World['settings'] }): Observable<World> {
    return this.http.post<World>(`${this.baseUrl}/api/worlds`, data);
  }

  getWorld(code: string): Observable<World> {
    return this.http.get<World>(`${this.baseUrl}/api/worlds/${code}`);
  }

  joinWorld(code: string): Observable<World> {
    return this.http.post<World>(`${this.baseUrl}/api/worlds/${code}/join`, {});
  }

  getLeaderboard(worldId: string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.baseUrl}/api/worlds/${worldId}/leaderboard`);
  }

  // Company endpoints
  createCompany(data: { worldId: string; name: string; sector: Company['sector']; tagline: string }): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/api/companies`, data);
  }

  getCompanies(worldId: string): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/api/companies/${worldId}`);
  }

  // Portfolio endpoints
  getPortfolio(worldId: string): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.baseUrl}/api/portfolio/${worldId}`);
  }
}
