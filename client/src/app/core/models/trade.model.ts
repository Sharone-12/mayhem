export type TradeType = 'buy' | 'sell';

export interface Trade {
  _id: string;
  worldId: string;
  userId: string;
  companyId: string;
  round: number;
  type: TradeType;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  createdAt: string;
}
