import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GameStateService } from '../../../core/services/game-state.service';
import { SocketService } from '../../../core/services/socket.service';
import { ApiService } from '../../../core/services/api.service';
import { GamePhase, Company } from '../../../core/models';
import { BriefingComponent } from '../briefing/briefing.component';
import { CeoPhaseComponent } from '../ceo-phase/ceo-phase.component';
import { MarketPhaseComponent } from '../market-phase/market-phase.component';
import { RecapComponent } from '../recap/recap.component';
import { FinalStandingsComponent } from '../final-standings/final-standings.component';

@Component({
  selector: 'app-game-shell',
  standalone: true,
  imports: [
    CommonModule,
    BriefingComponent,
    CeoPhaseComponent,
    MarketPhaseComponent,
    RecapComponent,
    FinalStandingsComponent
  ],
  templateUrl: './game-shell.component.html',
  styleUrl: './game-shell.component.scss'
})
export class GameShellComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private gameState = inject(GameStateService);
  private socket = inject(SocketService);
  private api = inject(ApiService);
  private subs: Subscription[] = [];

  currentPhase: GamePhase = 'briefing';
  currentRound = 1;
  totalRounds = 6;
  companies: Company[] = [];
  timeRemaining = 0;
  showLeaderboard = false;

  ngOnInit(): void {
    const worldId = this.route.snapshot.paramMap.get('worldId') || '';
    this.socket.emit('join-world', { worldCode: worldId });

    this.subs.push(
      this.gameState.currentPhase$.subscribe(phase => this.currentPhase = phase),
      this.gameState.currentRound$.subscribe(round => this.currentRound = round),
      this.gameState.companies$.subscribe(companies => this.companies = companies),
      this.gameState.phaseEndTime$.subscribe(endTime => {
        this.updateTimeRemaining(endTime);
      }),
      interval(1000).subscribe(() => {
        this.updateTimeRemaining(this.gameState.phaseEndTime$.value);
      })
    );

    this.api.getCompanies(worldId).subscribe(companies => {
      this.gameState.companies$.next(companies);
    });
  }

  private updateTimeRemaining(endTime: Date | null): void {
    if (!endTime) {
      this.timeRemaining = 0;
      return;
    }
    this.timeRemaining = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));
  }

  get phaseLabel(): string {
    const labels: Record<string, string> = {
      briefing: 'MARKET BRIEFING',
      ceo: 'CEO DECISIONS',
      market: 'MARKET OPEN',
      recap: 'ROUND RECAP',
      finished: 'GAME OVER'
    };
    return labels[this.currentPhase] || '';
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleLeaderboard(): void {
    this.showLeaderboard = !this.showLeaderboard;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
