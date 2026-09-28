import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

interface Avatar {
  emoji: string;
  name: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);

  username = '';
  selectedAvatar: string = '';
  isLoggedIn = false;
  tickerItems: { symbol: string; price: number; change: number }[] = [];
  private animationFrame: number | null = null;

  avatars: Avatar[] = [
    { emoji: '🐂', name: 'bull' },
    { emoji: '🐻', name: 'bear' },
    { emoji: '💎', name: 'diamond' },
    { emoji: '🚀', name: 'rocket' },
    { emoji: '📈', name: 'chart' },
    { emoji: '🪙', name: 'coin' },
    { emoji: '👑', name: 'crown' },
    { emoji: '🔥', name: 'fire' },
    { emoji: '👻', name: 'ghost' },
    { emoji: '🦈', name: 'shark' },
    { emoji: '🐋', name: 'whale' },
    { emoji: '🐺', name: 'wolf' },
  ];

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.generateTickerItems();
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  selectAvatar(avatar: Avatar): void {
    this.selectedAvatar = avatar.name;
  }

  enter(): void {
    if (!this.username.trim() || !this.selectedAvatar) return;
    this.authService.register(this.username.trim(), this.selectedAvatar as User['avatar']).subscribe(() => {
      this.isLoggedIn = true;
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }

  navigateToJoin(): void {
    this.router.navigate(['/join']);
  }

  get canEnter(): boolean {
    return this.username.trim().length > 0 && this.selectedAvatar.length > 0;
  }

  private generateTickerItems(): void {
    const symbols = ['AAPL', 'GOOG', 'TSLA', 'AMZN', 'MSFT', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC', 'UBER', 'SNAP', 'COIN', 'RBLX'];
    this.tickerItems = symbols.map(symbol => ({
      symbol,
      price: Math.round((50 + Math.random() * 450) * 100) / 100,
      change: Math.round((Math.random() * 20 - 10) * 100) / 100,
    }));
  }
}
