export type Sentiment = 'bullish' | 'bearish';
export type Reaction = 'rocket' | 'skull';

export interface News {
  _id: string;
  worldId: string;
  authorId: string;
  authorUsername?: string;
  authorAvatar?: string;
  round: number;
  content: string;
  targetCompanyId: string;
  targetCompanyName?: string;
  sentiment: Sentiment;
  reactions: {
    rocket: string[];
    skull: string[];
  };
  appliedImpact: number;
  createdAt: string;
}
