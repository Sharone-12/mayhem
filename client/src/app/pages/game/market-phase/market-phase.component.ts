import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../../core/services/game-state.service';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company, News, Sentiment } from '../../../core/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-market-phase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market-phase.component.html',
  styleUrl: './market-phase.component.scss'
})
export class MarketPhaseComponent {
  private gameState = inject(GameStateService);
  private socket = inject(SocketService);
  private auth = inject(AuthService);

  companies$ = this.gameState.companies$;
  newsFeed$ = this.gameState.newsFeed$;
  myPortfolio$ = this.gameState.myPortfolio$;

  selectedCompanyId: string | null = null;
  tradeQuantity = 1;
  newsContent = '';
  newsTargetCompanyId = '';
  newsSentiment: Sentiment = 'bullish';
  newsPostsRemaining = 3;
  quickAmounts = [1, 5, 10, 25];

  get selectedCompany(): Company | null {
    if (!this.selectedCompanyId) return null;
    return this.gameState.companies$.value.find(c => c._id === this.selectedCompanyId) || null;
  }

  getPriceChange(company: Company): number {
    if (!company.previousPrice) return 0;
    return ((company.stockPrice - company.previousPrice) / company.previousPrice) * 100;
  }

  get estimatedCost(): number {
    return (this.selectedCompany?.stockPrice || 0) * this.tradeQuantity;
  }

  get currentCash(): number {
    return this.gameState.myPortfolio$.value?.cash || 0;
  }

  selectCompany(companyId: string): void {
    this.selectedCompanyId = this.selectedCompanyId === companyId ? null : companyId;
    this.tradeQuantity = 1;
  }

  setQuantity(qty: number): void {
    this.tradeQuantity = qty;
  }

  setMaxBuy(): void {
    const price = this.selectedCompany?.stockPrice || 1;
    this.tradeQuantity = Math.floor(this.currentCash / price);
  }

  getHeldShares(companyId: string): number {
    const portfolio = this.gameState.myPortfolio$.value;
    if (!portfolio) return 0;
    const holding = portfolio.holdings.find((h: { companyId: string; shares: number }) => h.companyId === companyId);
    return holding?.shares || 0;
  }

  executeTrade(type: 'buy' | 'sell'): void {
    if (!this.selectedCompanyId || this.tradeQuantity < 1) return;
    const world = this.gameState.currentWorld$.value;
    if (!world) return;

    this.socket.emit('execute-trade', {
      worldId: world._id,
      companyId: this.selectedCompanyId,
      type,
      shares: this.tradeQuantity
    });
  }

  postNews(): void {
    if (!this.newsContent.trim() || !this.newsTargetCompanyId || this.newsPostsRemaining <= 0) return;
    const world = this.gameState.currentWorld$.value;
    if (!world) return;

    this.socket.emit('post-news', {
      worldId: world._id,
      content: this.newsContent.trim(),
      targetCompanyId: this.newsTargetCompanyId,
      sentiment: this.newsSentiment
    });
    this.newsContent = '';
    this.newsPostsRemaining--;
  }

  reactToNews(newsId: string, reaction: 'rocket' | 'skull'): void {
    this.socket.emit('react-to-news', { newsId, reaction });
  }

  isMyNews(news: News): boolean {
    let userId: string | undefined;
    this.auth.currentUser$.pipe(take(1)).subscribe(u => userId = u?._id);
    return news.authorId === userId;
  }
}
