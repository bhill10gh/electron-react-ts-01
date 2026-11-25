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

export type HandDescription = {
  name: string;
  descr: string;
};

/** Best 5-card hand from hole cards + board (Hold'em). */
export function describeBestHand(
  holeCards: Card[],
  communityCards: Card[],
): HandDescription | null {
  if (holeCards.length < 2 || communityCards.length === 0) {
    return null;
  }

  const solved = evaluateHand([...holeCards, ...communityCards]);
  return { name: solved.name, descr: solved.descr };
}

export type WinnerInfo = {
  name: string;
  hand: HandDescription | null;
};

function solvedToDescription(solved: ReturnType<typeof Hand.solve>): HandDescription {
  return { name: solved.name, descr: solved.descr };
}

export function determineWinnerDetails(
  players: {
    name: string;
    cards: Card[];
    folded: boolean;
  }[],
  communityCards: Card[],
): WinnerInfo[] {
  const activePlayers = players.filter((player) => !player.folded);

  if (activePlayers.length === 0) {
    return [];
  }

  if (activePlayers.length === 1) {
    const player = activePlayers[0];
    return [
      {
        name: player.name,
        hand: describeBestHand(player.cards, communityCards),
      },
    ];
  }

  const hands = activePlayers.map((player) => ({
    name: player.name,
    hand: evaluateHand([...player.cards, ...communityCards]),
  }));

  const winningHands = Hand.winners(hands.map((item) => item.hand));

  return hands
    .filter((item) => winningHands.includes(item.hand))
    .map((item) => ({
      name: item.name,
      hand: solvedToDescription(item.hand),
    }));
}

export function determineWinner(
  players: {
    name: string;
    cards: Card[];
    folded: boolean;
  }[],
  communityCards: Card[],
) {
  return determineWinnerDetails(players, communityCards).map((winner) => winner.name);
}
