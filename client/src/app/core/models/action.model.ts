export type CeoActionType = 'launch_product' | 'invest_rd' | 'aggressive_marketing' | 'hire_talent' | 'cut_costs' | 'partnership' | 'hostile_takeover';
export type PartnershipStatus = 'pending' | 'accepted' | 'declined';

export interface CeoAction {
  _id: string;
  worldId: string;
  userId: string;
  companyId: string;
  round: number;
  action: CeoActionType;
  targetCompanyId: string | null;
  productName: string | null;
  partnershipStatus: PartnershipStatus | null;
  takeoverSuccess: boolean | null;
  cost: number;
  resolved: boolean;
  createdAt: string;
}
