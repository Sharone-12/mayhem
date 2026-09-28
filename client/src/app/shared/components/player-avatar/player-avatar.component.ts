import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

const AVATAR_EMOJI_MAP: Record<string, string> = {
  bull: '🐂',
  bear: '🐻',
  diamond: '💎',
  rocket: '🚀',
  chart: '📈',
  coin: '🪙',
  crown: '👑',
  fire: '🔥',
  ghost: '👻',
  shark: '🦈',
  whale: '🐋',
  wolf: '🐺'
};

@Component({
  selector: 'app-player-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player-avatar" [ngClass]="size">
      <span class="avatar-emoji">{{ emojiForAvatar }}</span>
      <span class="username" *ngIf="username">{{ username }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .player-avatar {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .avatar-emoji {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .username {
      font-family: 'Inter', 'Space Grotesk', sans-serif;
      color: #E0E0E0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Size: sm */
    .sm .avatar-emoji {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }

    .sm .username {
      font-size: 0.75rem;
      font-weight: 500;
      max-width: 80px;
    }

    /* Size: md */
    .md .avatar-emoji {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }

    .md .username {
      font-size: 0.85rem;
      font-weight: 500;
      max-width: 120px;
    }

    /* Size: lg */
    .lg .avatar-emoji {
      width: 48px;
      height: 48px;
      font-size: 24px;
    }

    .lg .username {
      font-size: 1rem;
      font-weight: 600;
      max-width: 160px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerAvatarComponent {
  @Input() avatar: string = '';
  @Input() username: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get emojiForAvatar(): string {
    return AVATAR_EMOJI_MAP[this.avatar] || '👤';
  }
}
