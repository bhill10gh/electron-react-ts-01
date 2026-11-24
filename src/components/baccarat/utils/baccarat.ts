import type { Card, Suit, Rank, GameResult } from "../types/baccarat.types";

const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

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

function getCardValue(rank: Rank): number {
  if (rank === "A") return 1;

  if (["10", "J", "Q", "K"].includes(rank)) {
    return 0;
  }

  return Number(rank);
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        value: getCardValue(rank),
      });
    }
  }

  return deck;
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
  const total = cards.reduce((sum, card) => sum + card.value, 0);

  return total % 10;
}

export function determineWinner(
  playerScore: number,
  bankerScore: number,
): GameResult {
  if (playerScore > bankerScore) return "player";

  if (bankerScore > playerScore) return "banker";

  return "tie";
}

export interface DealResult {
  playerCards: Card[];
  bankerCards: Card[];
  playerScore: number;
  bankerScore: number;
  result: GameResult;
}

export function dealCards(): DealResult {
  const deck = shuffleDeck(createDeck());

  let index = 0;

  const playerCards = [deck[index++], deck[index++]];
  const bankerCards = [deck[index++], deck[index++]];

  let playerScore = calculateScore(playerCards);
  let bankerScore = calculateScore(bankerCards);

  // Natural 8 or 9: neither hand draws.
  const natural = playerScore >= 8 || bankerScore >= 8;

  if (!natural) {
    let playerThirdCard: Card | undefined;

    // Player draws on 0 through 5.
    if (playerScore <= 5) {
      playerThirdCard = deck[index++];
      playerCards.push(playerThirdCard);
    }

    playerScore = calculateScore(playerCards);

    // Banker drawing rules.
    if (!playerThirdCard) {
      // Player stood. Banker draws on 0 through 5.
      if (bankerScore <= 5) {
        bankerCards.push(deck[index++]);
      }
    } else {
      const thirdValue = playerThirdCard.value;

      const bankerDraws =
        bankerScore <= 2 ||
        (bankerScore === 3 && thirdValue !== 8) ||
        (bankerScore === 4 && thirdValue >= 2 && thirdValue <= 7) ||
        (bankerScore === 5 && thirdValue >= 4 && thirdValue <= 7) ||
        (bankerScore === 6 && (thirdValue === 6 || thirdValue === 7));

      if (bankerDraws) {
        bankerCards.push(deck[index++]);
      }
    }
  }

  playerScore = calculateScore(playerCards);
  bankerScore = calculateScore(bankerCards);

  return {
    playerCards,
    bankerCards,
    playerScore,
    bankerScore,
    result: determineWinner(playerScore, bankerScore),
  };
}
