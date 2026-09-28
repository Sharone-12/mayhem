import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';
import { World, Company, Portfolio, News, User, GamePhase } from '../models';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private socketService = inject(SocketService);

  currentWorld$ = new BehaviorSubject<World | null>(null);
  companies$ = new BehaviorSubject<Company[]>([]);
  myPortfolio$ = new BehaviorSubject<Portfolio | null>(null);
  myCompany$ = new BehaviorSubject<Company | null>(null);
  currentPhase$ = new BehaviorSubject<GamePhase>('briefing');
  currentRound$ = new BehaviorSubject<number>(0);
  newsFeed$ = new BehaviorSubject<News[]>([]);
  phaseEndTime$ = new BehaviorSubject<Date | null>(null);
  players$ = new BehaviorSubject<User[]>([]);

  constructor() {
    this.subscribeToSocketEvents();
  }

  private subscribeToSocketEvents(): void {
    // World updates
    this.socketService.onWorldUpdated$.subscribe(world => {
      this.currentWorld$.next(world);
      this.currentPhase$.next(world.currentPhase);
      this.currentRound$.next(world.currentRound);
      if (world.phaseEndsAt) {
        this.phaseEndTime$.next(new Date(world.phaseEndsAt));
      }
      if (Array.isArray(world.players) && world.players.length > 0 && typeof world.players[0] === 'object') {
        this.players$.next(world.players as User[]);
      }
    });

    // Player events
    this.socketService.onPlayerJoined$.subscribe(player => {
      const currentPlayers = this.players$.getValue();
      if (!currentPlayers.find(p => p._id === player._id)) {
        this.players$.next([...currentPlayers, player]);
      }
    });

    this.socketService.onPlayerLeft$.subscribe(({ userId }) => {
      const currentPlayers = this.players$.getValue();
      this.players$.next(currentPlayers.filter(p => p._id !== userId));
    });

    // Game flow events
    this.socketService.onGameStarted$.subscribe(world => {
      this.currentWorld$.next(world);
      this.currentPhase$.next(world.currentPhase);
      this.currentRound$.next(world.currentRound);
    });

    this.socketService.onRoundStarted$.subscribe(({ round, marketCondition }) => {
      this.currentRound$.next(round);
      const world = this.currentWorld$.getValue();
      if (world) {
        this.currentWorld$.next({ ...world, currentRound: round, currentMarketCondition: marketCondition });
      }
    });

    this.socketService.onPhaseChanged$.subscribe(({ phase, endsAt }) => {
      this.currentPhase$.next(phase);
      this.phaseEndTime$.next(endsAt ? new Date(endsAt) : null);
      const world = this.currentWorld$.getValue();
      if (world) {
        this.currentWorld$.next({ ...world, currentPhase: phase, phaseEndsAt: endsAt });
      }
    });

    // Company events
    this.socketService.onCompanyCreated$.subscribe(company => {
      const current = this.companies$.getValue();
      this.companies$.next([...current, company]);
    });

    // Price updates
    this.socketService.onPriceUpdate$.subscribe(({ companyId, newPrice, previousPrice }) => {
      this.updateCompanyPrice(companyId, newPrice, previousPrice);
    });

    // CEO phase results
    this.socketService.onCeoPhaseResults$.subscribe(({ companies }) => {
      this.companies$.next(companies);
    });

    // News events
    this.socketService.onNewsPosted$.subscribe(news => {
      const current = this.newsFeed$.getValue();
      this.newsFeed$.next([news, ...current]);
    });

    this.socketService.onNewsReactionUpdated$.subscribe(updatedNews => {
      const current = this.newsFeed$.getValue();
      this.newsFeed$.next(current.map(n => n._id === updatedNews._id ? updatedNews : n));
    });

    // Portfolio updates
    this.socketService.onPortfolioUpdated$.subscribe(portfolio => {
      this.myPortfolio$.next(portfolio);
    });

    // Game over
    this.socketService.onGameOver$.subscribe(() => {
      this.currentPhase$.next('finished');
      const world = this.currentWorld$.getValue();
      if (world) {
        this.currentWorld$.next({ ...world, status: 'finished', currentPhase: 'finished' });
      }
    });
  }

  updateCompanyPrice(companyId: string, newPrice: number, previousPrice: number): void {
    const companies = this.companies$.getValue();
    this.companies$.next(
      companies.map(c =>
        c._id === companyId ? { ...c, stockPrice: newPrice, previousPrice } : c
      )
    );
  }

  reset(): void {
    this.currentWorld$.next(null);
    this.companies$.next([]);
    this.myPortfolio$.next(null);
    this.myCompany$.next(null);
    this.currentPhase$.next('briefing');
    this.currentRound$.next(0);
    this.newsFeed$.next([]);
    this.phaseEndTime$.next(null);
    this.players$.next([]);
  }
}
