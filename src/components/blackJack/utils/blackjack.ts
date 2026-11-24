import type { Card, Rank, Suit, Hand } from "../types/blackjack";

const suits: Suit[] = ["♠", "♥", "♦", "♣"];

const ranks: Rank[] = [
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

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      const value =
        rank === "A" ? 11 : ["J", "Q", "K"].includes(rank) ? 10 : Number(rank);

      deck.push({
        suit,
        rank,
        value,
        id: `${suit}-${rank}-${Math.random()}`,
      });
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function calculateScore(cards: Card[]): number {
  let score = cards.reduce((total, card) => total + card.value, 0);

  let aces = cards.filter((card) => card.rank === "A").length;

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

export function createHand(cards: Card[]): Hand {
  const score = calculateScore(cards);

  return {
    cards,
    score,
    isBlackjack: cards.length === 2 && score === 21,
    isBust: score > 21,
  };
}

export function drawCard(deck: Card[]) {
  const newDeck = [...deck];
  const card = newDeck.pop();

  if (!card) {
    throw new Error("No cards remaining in deck");
  }

  return {
    card,
    deck: newDeck,
  };
}
