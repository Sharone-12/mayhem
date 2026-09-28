export type Sector = 'AI' | 'Fintech' | 'E-Commerce' | 'Gaming' | 'Healthcare' | 'Energy' | 'Food & Beverage' | 'Social Media' | 'Space' | 'Memes';

export interface CompanyFundamentals {
  revenue: number;
  growthRate: number;
  morale: number;
  cashReserves: number;
}

export interface PriceHistoryEntry {
  round: number;
  price: number;
}

export interface Company {
  _id: string;
  worldId: string;
  ownerId: string | null;
  name: string;
  sector: Sector;
  tagline: string;
  isReal: boolean;
  isAcquired: boolean;
  acquiredBy: string | null;
  stockPrice: number;
  previousPrice: number;
  priceHistory: PriceHistoryEntry[];
  fundamentals: CompanyFundamentals;
  totalShares: number;
  rdInvestments: number;
  consecutiveMarketingRounds: number;
  createdAt: string;
}
