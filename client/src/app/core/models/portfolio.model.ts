export interface Holding {
  companyId: string;
  shares: number;
  avgBuyPrice: number;
}

export interface ValueHistoryEntry {
  round: number;
  value: number;
}

export interface Portfolio {
  _id: string;
  worldId: string;
  userId: string;
  cash: number;
  holdings: Holding[];
  totalValue: number;
  valueHistory: ValueHistoryEntry[];
}
