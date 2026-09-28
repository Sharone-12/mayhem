import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-create-world',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-world.component.html',
  styleUrl: './create-world.component.scss'
})
export class CreateWorldComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);

  worldName = '';
  numberOfRounds = 6;
  ceoPhaseDuration = 60;
  marketPhaseDuration = 90;
  startingCash = 100000;
  includeRealCompanies = true;
  maxPlayers = 10;
  isSubmitting = false;

  roundOptions = [4, 6, 8];
  playerOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  get formattedCash(): string {
    return this.formatIndianCurrency(this.startingCash);
  }

  formatIndianCurrency(value: number): string {
    const str = value.toString();
    if (str.length <= 3) return str;
    let result = str.slice(-3);
    let remaining = str.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
    return result;
  }

  get isValid(): boolean {
    return this.worldName.trim().length > 0 && this.worldName.trim().length <= 30;
  }

  createWorld(): void {
    if (!this.isValid || this.isSubmitting) return;
    this.isSubmitting = true;

    this.apiService.createWorld({
      name: this.worldName.trim(),
      settings: {
        totalRounds: this.numberOfRounds as 4 | 6 | 8,
        ceoPhaseDuration: this.ceoPhaseDuration,
        marketPhaseDuration: this.marketPhaseDuration,
        startingCash: this.startingCash,
        includeRealCompanies: this.includeRealCompanies,
        maxPlayers: this.maxPlayers,
      },
    }).subscribe({
      next: world => this.router.navigate(['/lobby', world._id]),
      error: () => this.isSubmitting = false,
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
