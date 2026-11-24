export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export interface Card {
  id: string;
  suit: Suit;
  rank: number;
  faceUp: boolean;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  tableau: Card[][];
  foundations: Card[][];
}

export type PileType = "stock" | "waste" | "tableau" | "foundation";

export interface Selection {
  pile: PileType;
  pileIndex: number;
  cardIndex: number;
}
