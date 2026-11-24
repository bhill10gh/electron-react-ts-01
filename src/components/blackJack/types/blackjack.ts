export type Suit = "♠" | "♥" | "♦" | "♣";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  id: string;
}

export interface Hand {
  cards: Card[];
  score: number;
  isBlackjack: boolean;
  isBust: boolean;
}

export type GameStatus =
  | "betting"
  | "playing"
  | "dealer"
  | "player-wins"
  | "dealer-wins"
  | "push"
  | "blackjack";

export interface GameState {
  deck: Card[];
  player: Hand;
  dealer: Hand;
  balance: number;
  bet: number;
  status: GameStatus;
  message: string;
  doubledDown: boolean;
}
