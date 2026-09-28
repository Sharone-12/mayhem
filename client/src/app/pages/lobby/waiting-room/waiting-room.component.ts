import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { SocketService } from '../../../core/services/socket.service';
import { GameStateService } from '../../../core/services/game-state.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Company, Sector, User } from '../../../core/models';

function getCurrentUserId(auth: AuthService): string | undefined {
  let userId: string | undefined;
  auth.currentUser$.pipe(take(1)).subscribe(u => userId = u?._id);
  return userId;
}
import { PlayerAvatarComponent } from '../../../shared/components/player-avatar/player-avatar.component';
import { InrCurrencyPipe } from '../../../shared/pipes/currency.pipe';

const SECTOR_PRICES: Record<string, number> = {
  'AI': 150, 'Fintech': 120, 'E-Commerce': 110, 'Gaming': 100,
  'Healthcare': 130, 'Energy': 115, 'Food & Beverage': 90,
  'Social Media': 105, 'Space': 160, 'Memes': 50
};

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayerAvatarComponent, InrCurrencyPipe],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss'
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private socket = inject(SocketService);
  private gameState = inject(GameStateService);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private subs: Subscription[] = [];

  worldName = '';
  worldCode = '';
  worldId = '';
  players: User[] = [];
  companies: Company[] = [];
  isHost = false;
  allReady = false;
  myCompanyCreated = false;

  companyName = '';
  companySector: Sector = 'AI';
  companyTagline = '';
  sectors: Sector[] = ['AI', 'Fintech', 'E-Commerce', 'Gaming', 'Healthcare', 'Energy', 'Food & Beverage', 'Social Media', 'Space', 'Memes'];

  get startingPrice(): number {
    return SECTOR_PRICES[this.companySector] || 100;
  }

  ngOnInit() {
    this.worldId = this.route.snapshot.paramMap.get('worldId') || '';

    this.subs.push(
      this.gameState.currentWorld$.subscribe(world => {
        if (world) {
          this.worldName = world.name;
          this.worldCode = world.code;
          this.isHost = world.host === getCurrentUserId(this.auth);
          this.players = (world.players || []) as User[];
        }
      }),
      this.gameState.companies$.subscribe(companies => {
        this.companies = companies;
        const userId = getCurrentUserId(this.auth);
        this.myCompanyCreated = companies.some(c => c.ownerId === userId);
        this.allReady = this.players.length >= 2 &&
          this.players.every(p => companies.some(c => c.ownerId === (typeof p === 'string' ? p : p._id)));
      }),
      this.socket.onGameStarted$.subscribe(() => {
        this.router.navigate(['/game', this.worldId]);
      })
    );

    this.api.getWorld(this.worldCode || this.worldId).subscribe();
    this.api.getCompanies(this.worldId).subscribe(companies => {
      this.gameState.companies$.next(companies);
    });
    this.socket.emit('join-world', { worldCode: this.worldCode || this.worldId });
  }

  createCompany() {
    if (!this.companyName.trim() || this.myCompanyCreated) return;
    this.socket.emit('create-company', {
      worldId: this.worldId,
      name: this.companyName.trim(),
      sector: this.companySector,
      tagline: this.companyTagline.trim()
    });
  }

  startGame() {
    if (!this.isHost || !this.allReady) return;
    this.socket.emit('start-game', { worldId: this.worldId });
  }

  copyCode() {
    navigator.clipboard.writeText(this.worldCode);
    this.toast.success('Room code copied!');
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
