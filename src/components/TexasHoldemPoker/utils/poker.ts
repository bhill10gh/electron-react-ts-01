import { Hand } from "pokersolver";
import { Card } from "../models/pokerTypes";

export function convertCard(card: Card): string {
  const rank = card.rank === "10" ? "T" : card.rank;

  return `${rank}${card.suit}`;
}

export function evaluateHand(cards: Card[]) {
  const pokerCards = cards.map(convertCard);

  return Hand.solve(pokerCards);
}

export function determineWinner(
  players: {
    name: string;
    cards: Card[];
    folded: boolean;
  }[],
  communityCards: Card[],
) {
  const activePlayers = players.filter((player) => !player.folded);

  const hands = activePlayers.map((player) => ({
    name: player.name,
    hand: evaluateHand([...player.cards, ...communityCards]),
  }));

  if (hands.length === 0) {
    return [];
  }

  const winningHands = Hand.winners(hands.map((item) => item.hand));

  return hands
    .filter((item) => winningHands.includes(item.hand))
    .map((item) => item.name);
}
