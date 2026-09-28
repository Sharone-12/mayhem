import { User } from './user.model';

export interface WorldSettings {
  maxPlayers: number;
  totalRounds: 4 | 6 | 8;
  ceoPhaseDuration: number;
  marketPhaseDuration: number;
  startingCash: number;
  includeRealCompanies: boolean;
}

export interface MarketConditionEffect {
  sector: string;
  modifier: number;
}

export interface MarketCondition {
  name: string;
  description: string;
  effects: MarketConditionEffect[];
}

export type WorldStatus = 'lobby' | 'active' | 'finished';
export type GamePhase = 'briefing' | 'ceo' | 'market' | 'recap' | 'finished';

export interface World {
  _id: string;
  name: string;
  code: string;
  host: string;
  status: WorldStatus;
  settings: WorldSettings;
  currentRound: number;
  currentPhase: GamePhase;
  phaseEndsAt: string;
  currentMarketCondition: MarketCondition | null;
  players: User[] | string[];
  createdAt: string;
  finishedAt?: string;
}
