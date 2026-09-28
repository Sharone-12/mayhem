import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../../core/services/game-state.service';

interface Award {
  title: string;
  icon: string;
  recipient: string;
  description: string;
}

@Component({
  selector: 'app-final-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-standings.component.html',
  styleUrl: './final-standings.component.scss'
})
export class FinalStandingsComponent {
  private gameState = inject(GameStateService);
  private router = inject(Router);

  companies$ = this.gameState.companies$;

  get sortedCompanies() {
    return [...this.gameState.companies$.value].sort((a, b) => b.stockPrice - a.stockPrice);
  }

  get winner() {
    const sorted = this.sortedCompanies;
    return sorted.length > 0 ? sorted[0] : null;
  }

  get finalValue(): number {
    return this.gameState.myPortfolio$.value?.totalValue || 0;
  }

  getMedal(index: number): string {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || `#${index + 1}`;
  }

  get awards(): Award[] {
    const finalAwards = (this.gameState as any).finalAwards$?.value;
    if (finalAwards) return finalAwards;

    return [
      { title: 'Market Manipulator', icon: '🎭', recipient: '---', description: 'Most news impact on prices' },
      { title: 'Diamond Hands', icon: '💎', recipient: '---', description: 'Held longest without selling' },
      { title: 'Paper Hands', icon: '🧻', recipient: '---', description: 'Most panic sells' },
      { title: 'Warren Buffett', icon: '🧓', recipient: '---', description: 'Best portfolio returns' },
      { title: 'CEO of the Year', icon: '👑', recipient: '---', description: 'Most effective CEO actions' },
      { title: 'Bankrupt', icon: '💸', recipient: '---', description: 'Lost the most money' },
    ];
  }

  playAgain(): void {
    this.router.navigate(['/']);
  }
}
