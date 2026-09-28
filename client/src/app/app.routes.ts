import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { gameGuard } from './core/guards/game.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/lobby/create-world/create-world.component').then(m => m.CreateWorldComponent),
    canActivate: [authGuard]
  },
  {
    path: 'join',
    loadComponent: () => import('./pages/lobby/join-world/join-world.component').then(m => m.JoinWorldComponent),
    canActivate: [authGuard]
  },
  {
    path: 'join/:code',
    loadComponent: () => import('./pages/lobby/join-world/join-world.component').then(m => m.JoinWorldComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lobby/:worldId',
    loadComponent: () => import('./pages/lobby/waiting-room/waiting-room.component').then(m => m.WaitingRoomComponent),
    canActivate: [authGuard]
  },
  {
    path: 'game/:worldId',
    loadComponent: () => import('./pages/game/game-shell/game-shell.component').then(m => m.GameShellComponent),
    canActivate: [authGuard, gameGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
