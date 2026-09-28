export interface User {
  _id: string;
  username: string;
  avatar: 'bull' | 'bear' | 'diamond' | 'rocket' | 'chart' | 'coin' | 'crown' | 'fire' | 'ghost' | 'shark' | 'whale' | 'wolf';
  stats: {
    gamesPlayed: number;
    wins: number;
    totalEarnings: number;
  };
  createdAt: string;
}
