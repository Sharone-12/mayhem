import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../../core/services/game-state.service';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Company, CeoActionType } from '../../../core/models';
import { take } from 'rxjs';

interface ActionCard {
  type: CeoActionType;
  name: string;
  icon: string;
  costLabel: string;
  effect: string;
  needsTarget: boolean;
  needsProductName: boolean;
  minRound?: number;
}

const ACTIONS: ActionCard[] = [
  { type: 'launch_product', name: 'Launch Product', icon: '🚀', costLabel: '15% revenue', effect: '+12% revenue next round, +5% stock price', needsTarget: false, needsProductName: true },
  { type: 'invest_rd', name: 'Invest in R&D', icon: '🔬', costLabel: '10% revenue', effect: '+3% compound growth rate (stacks)', needsTarget: false, needsProductName: false },
  { type: 'aggressive_marketing', name: 'Aggressive Marketing', icon: '📢', costLabel: '20% revenue', effect: '+8% stock price, +3% next round', needsTarget: false, needsProductName: false },
  { type: 'hire_talent', name: 'Hire Talent', icon: '💼', costLabel: '12% revenue', effect: 'Your growth +2%, target -2%', needsTarget: true, needsProductName: false },
  { type: 'cut_costs', name: 'Cut Costs', icon: '✂️', costLabel: 'Free', effect: '+15% cash, -4% growth permanently', needsTarget: false, needsProductName: false },
  { type: 'partnership', name: 'Partnership', icon: '🤝', costLabel: '8% both revenue', effect: 'Both +5% price, +2% growth (needs accept)', needsTarget: true, needsProductName: false },
  { type: 'hostile_takeover', name: 'Hostile Takeover', icon: '💀', costLabel: '30% cash', effect: 'Absorb target (<60% your price). Round 3+ only', needsTarget: true, needsProductName: false, minRound: 3 },
];

@Component({
  selector: 'app-ceo-phase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ceo-phase.component.html',
  styleUrl: './ceo-phase.component.scss'
})
export class CeoPhaseComponent {
  private gameState = inject(GameStateService);
  private socket = inject(SocketService);
  private auth = inject(AuthService);

  actions = ACTIONS;
  selectedAction: ActionCard | null = null;
  targetCompanyId = '';
  productName = '';
  submitted = false;
  submittedPlayers: string[] = [];

  get myCompany(): Company | null {
    return this.gameState.myCompany$.value;
  }

  get otherCompanies(): Company[] {
    let userId: string | undefined;
    this.auth.currentUser$.pipe(take(1)).subscribe(u => userId = u?._id);
    return this.gameState.companies$.value.filter(c => c.ownerId !== userId && !c.isReal && !c.isAcquired);
  }

  get currentRound(): number {
    return this.gameState.currentRound$.value;
  }

  canAfford(action: ActionCard): boolean {
    const company = this.myCompany;
    if (!company) return false;
    const rev = company.fundamentals.revenue;
    const cash = company.fundamentals.cashReserves;
    switch (action.type) {
      case 'launch_product': return rev * 0.15 <= cash;
      case 'invest_rd': return rev * 0.10 <= cash;
      case 'aggressive_marketing': return rev * 0.20 <= cash;
      case 'hire_talent': return rev * 0.12 <= cash;
      case 'cut_costs': return true;
      case 'partnership': return rev * 0.08 <= cash;
      case 'hostile_takeover': return cash * 0.30 > 0;
      default: return true;
    }
  }

  isAvailable(action: ActionCard): boolean {
    if (action.minRound && this.currentRound < action.minRound) return false;
    return this.canAfford(action);
  }

  selectAction(action: ActionCard): void {
    if (this.submitted || !this.isAvailable(action)) return;
    this.selectedAction = action;
    this.targetCompanyId = '';
    this.productName = '';
  }

  confirmAction(): void {
    if (!this.selectedAction || this.submitted) return;
    const world = this.gameState.currentWorld$.value;
    if (!world) return;

    this.socket.emit('submit-ceo-action', {
      worldId: world._id,
      action: this.selectedAction.type,
      targetCompanyId: this.selectedAction.needsTarget ? this.targetCompanyId : undefined,
      productName: this.selectedAction.needsProductName ? this.productName : undefined
    });
    this.submitted = true;
  }
}
