export type Suit = "S" | "H" | "D" | "C";

export type Card = {
  rank: string;
  suit: Suit;
};

export type Player = {
  id: number;
  name: string;
  cards: Card[];
  chips: number;
  bet: number;
  folded: boolean;
  isDealer: boolean;
  isHuman: boolean;
};

export type GameStage = "preflop" | "flop" | "turn" | "river" | "showdown";

export type PokerAction = "fold" | "check" | "call" | "raise";
