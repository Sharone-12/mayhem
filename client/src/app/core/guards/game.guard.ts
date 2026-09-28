import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';

export const gameGuard: CanActivateFn = () => {
  const gameState = inject(GameStateService);
  const router = inject(Router);

  const world = gameState.currentWorld$.getValue();

  if (world && world.status === 'active') {
    return true;
  }

  if (world) {
    return router.createUrlTree(['/lobby', world.code]);
  }

  return router.createUrlTree(['/']);
};
