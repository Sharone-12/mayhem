import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { World, Company, User, News, Portfolio, CeoAction, Trade } from '../models';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private socketUrl = environment.socketUrl;

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(this.socketUrl, {
      auth: { token }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: unknown): void {
    this.socket?.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(subscriber => {
      if (!this.socket) {
        subscriber.error('Socket not connected');
        return;
      }

      const handler = (data: T) => subscriber.next(data);
      this.socket.on(event, handler as (...args: unknown[]) => void);

      return () => {
        this.socket?.off(event, handler as (...args: unknown[]) => void);
      };
    });
  }

  // Lobby events
  get onPlayerJoined$(): Observable<User> {
    return this.on<User>('player-joined');
  }

  get onPlayerLeft$(): Observable<{ userId: string }> {
    return this.on<{ userId: string }>('player-left');
  }

  get onWorldUpdated$(): Observable<World> {
    return this.on<World>('world-updated');
  }

  // Company events
  get onCompanyCreated$(): Observable<Company> {
    return this.on<Company>('company-created');
  }

  get onAllReady$(): Observable<void> {
    return this.on<void>('all-ready');
  }

  // Game flow events
  get onGameStarted$(): Observable<World> {
    return this.on<World>('game-started');
  }

  get onRoundStarted$(): Observable<{ round: number; marketCondition: World['currentMarketCondition'] }> {
    return this.on<{ round: number; marketCondition: World['currentMarketCondition'] }>('round-started');
  }

  get onPhaseChanged$(): Observable<{ phase: World['currentPhase']; endsAt: string }> {
    return this.on<{ phase: World['currentPhase']; endsAt: string }>('phase-changed');
  }

  get onRoundEnded$(): Observable<{ round: number }> {
    return this.on<{ round: number }>('round-ended');
  }

  get onGameOver$(): Observable<{ leaderboard: Portfolio[] }> {
    return this.on<{ leaderboard: Portfolio[] }>('game-over');
  }

  // CEO phase events
  get onActionSubmitted$(): Observable<CeoAction> {
    return this.on<CeoAction>('action-submitted');
  }

  get onPartnershipRequest$(): Observable<CeoAction> {
    return this.on<CeoAction>('partnership-request');
  }

  get onPartnershipResponse$(): Observable<CeoAction> {
    return this.on<CeoAction>('partnership-response');
  }

  get onCeoPhaseResults$(): Observable<{ actions: CeoAction[]; companies: Company[] }> {
    return this.on<{ actions: CeoAction[]; companies: Company[] }>('ceo-phase-results');
  }

  // Market phase events
  get onTradeExecuted$(): Observable<Trade> {
    return this.on<Trade>('trade-executed');
  }

  get onPriceUpdate$(): Observable<{ companyId: string; newPrice: number; previousPrice: number }> {
    return this.on<{ companyId: string; newPrice: number; previousPrice: number }>('price-update');
  }

  get onPortfolioUpdated$(): Observable<Portfolio> {
    return this.on<Portfolio>('portfolio-updated');
  }

  // News events
  get onNewsPosted$(): Observable<News> {
    return this.on<News>('news-posted');
  }

  get onNewsReactionUpdated$(): Observable<News> {
    return this.on<News>('news-reaction-updated');
  }

  // Error events
  get onError$(): Observable<{ message: string }> {
    return this.on<{ message: string }>('error');
  }
}
