import type { Card, Suit, GameState } from "../types/solitaire";

export const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

export const suitSymbols: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export const rankNames = [
  "",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export const isRed = (suit: Suit) => suit === "hearts" || suit === "diamonds";

export function createDeck(): Card[] {
  return suits.flatMap((suit) =>
    Array.from({ length: 13 }, (_, i) => ({
      id: `${suit}-${i + 1}`,
      suit,
      rank: i + 1,
      faceUp: false,
    })),
  );
}

export function shuffle(deck: Card[]): Card[] {
  const cards = [...deck];

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function newGame(): GameState {
  const deck = shuffle(createDeck());

  const tableau: Card[][] = Array.from({ length: 7 }, () => []);

  let index = 0;

  for (let column = 0; column < 7; column++) {
    for (let row = 0; row <= column; row++) {
      tableau[column].push({
        ...deck[index++],
        faceUp: row === column,
      });
    }
  }

  return {
    stock: deck.slice(index),
    waste: [],
    tableau,
    foundations: [[], [], [], []],
  };
}

export function canMoveToTableau(cards: Card[], destination: Card[]): boolean {
  const first = cards[0];

  if (!first || !first.faceUp) return false;

  if (destination.length === 0) {
    return first.rank === 13;
  }

  const top = destination[destination.length - 1];

  return (
    top.faceUp &&
    isRed(top.suit) !== isRed(first.suit) &&
    top.rank === first.rank + 1
  );
}

export function canMoveToFoundation(card: Card, foundation: Card[]): boolean {
  if (!card.faceUp) return false;

  if (foundation.length === 0) {
    return card.rank === 1;
  }

  const top = foundation[foundation.length - 1];

  return top.suit === card.suit && top.rank + 1 === card.rank;
}
