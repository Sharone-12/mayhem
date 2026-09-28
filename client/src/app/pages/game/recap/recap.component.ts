import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../../core/services/game-state.service';
import { InrCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { PercentChangePipe } from '../../../shared/pipes/percent-change.pipe';

interface RecapStat {
  title: string;
  icon: string;
  name: string;
  value: string;
}

@Component({
  selector: 'app-recap',
  standalone: true,
  imports: [CommonModule, InrCurrencyPipe, PercentChangePipe],
  templateUrl: './recap.component.html',
  styleUrl: './recap.component.scss'
})
export class RecapComponent {
  private gameState = inject(GameStateService);

  companies$ = this.gameState.companies$;
  myPortfolio$ = this.gameState.myPortfolio$;
  currentRound$ = this.gameState.currentRound$;

  get portfolioValue(): number {
    const portfolio = this.gameState.myPortfolio$.value;
    return portfolio?.totalValue || 0;
  }

  get portfolioCash(): number {
    const portfolio = this.gameState.myPortfolio$.value;
    return portfolio?.cash || 0;
  }

  getValueChange(): number {
    const portfolio = this.gameState.myPortfolio$.value;
    if (!portfolio || !portfolio.valueHistory || portfolio.valueHistory.length < 2) return 0;
    const history = portfolio.valueHistory;
    const current = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    return ((current - previous) / previous) * 100;
  }

  getPriceChange(company: { stockPrice: number; previousPrice?: number }): number {
    if (!company.previousPrice) return 0;
    return ((company.stockPrice - company.previousPrice) / company.previousPrice) * 100;
  }

  get recapStats(): RecapStat[] {
    const recap = (this.gameState as any).roundRecap$?.value;
    if (!recap) return this.generateDefaultStats();
    return [
      { title: 'Biggest Gainer', icon: '📈', name: recap.biggestGainer?.name || '---', value: recap.biggestGainer?.change ? `+${recap.biggestGainer.change.toFixed(1)}%` : '' },
      { title: 'Biggest Loser', icon: '📉', name: recap.biggestLoser?.name || '---', value: recap.biggestLoser?.change ? `${recap.biggestLoser.change.toFixed(1)}%` : '' },
      { title: 'Wolf of Wall Street', icon: '🐺', name: recap.topTrader?.name || '---', value: recap.topTrader?.trades ? `${recap.topTrader.trades} trades` : '' },
      { title: 'Fake News King', icon: '📰', name: recap.fakeNewsKing?.name || '---', value: recap.fakeNewsKing?.impact ? `${recap.fakeNewsKing.impact.toFixed(1)}% impact` : '' },
      { title: 'Best CEO Move', icon: '👑', name: recap.bestCeoMove?.name || '---', value: recap.bestCeoMove?.action || '' },
    ];
  }

  private generateDefaultStats(): RecapStat[] {
    const companies = this.gameState.companies$.value;
    if (!companies.length) return [];

    const sorted = [...companies].sort((a, b) => {
      const aChange = this.getPriceChange(a);
      const bChange = this.getPriceChange(b);
      return bChange - aChange;
    });

    return [
      { title: 'Biggest Gainer', icon: '📈', name: sorted[0]?.name || '---', value: sorted[0] ? `+${this.getPriceChange(sorted[0]).toFixed(1)}%` : '' },
      { title: 'Biggest Loser', icon: '📉', name: sorted[sorted.length - 1]?.name || '---', value: sorted[sorted.length - 1] ? `${this.getPriceChange(sorted[sorted.length - 1]).toFixed(1)}%` : '' },
      { title: 'Wolf of Wall Street', icon: '🐺', name: '---', value: '' },
      { title: 'Fake News King', icon: '📰', name: '---', value: '' },
      { title: 'Best CEO Move', icon: '👑', name: '---', value: '' },
    ];
  }
}
