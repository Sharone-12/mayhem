import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerAvatarComponent } from '../player-avatar/player-avatar.component';
import { InrCurrencyPipe } from '../../pipes/currency.pipe';

export interface LeaderboardPlayer {
  username: string;
  avatar: string;
  value: number;
}

@Component({
  selector: 'app-mini-leaderboard',
  standalone: true,
  imports: [CommonModule, PlayerAvatarComponent, InrCurrencyPipe],
  templateUrl: './mini-leaderboard.component.html',
  styleUrls: ['./mini-leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniLeaderboardComponent {
  @Input() players: LeaderboardPlayer[] = [];
  @Input() title: string = 'Leaderboard';
  @Input() valueLabel: string = 'Portfolio';

  get sortedPlayers(): LeaderboardPlayer[] {
    return [...this.players].sort((a, b) => b.value - a.value);
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }

  trackByUsername(_index: number, player: LeaderboardPlayer): string {
    return player.username;
  }
}
