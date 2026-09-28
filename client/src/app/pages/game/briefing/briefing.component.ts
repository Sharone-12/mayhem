import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../../core/services/game-state.service';

@Component({
  selector: 'app-briefing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './briefing.component.html',
  styleUrl: './briefing.component.scss'
})
export class BriefingComponent {
  gameState = inject(GameStateService);
}
