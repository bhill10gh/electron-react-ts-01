declare module "pokersolver" {
  export class Card {
    value: string;
    suit: string;
    rank: number;
    wildValue: string;
    toString(): string;
    static sort(a: Card, b: Card): number;
  }

  export class Game {
    constructor(descr?: string);
    descr: string;
    handValues: unknown[];
    lowestQualified: string[] | null;
  }

  export class Hand {
    cardPool: Card[];
    cards: Card[];
    suits: Record<string, Card[]>;
    values: number[];
    wilds: Card[];
    name: string;
    descr: string;
    rank: number;
    game: Game;
    sfLength: number;
    alwaysQualifies: boolean;

    toString(): string;
    compare(hand: Hand): number;
    loseTo(hand: Hand): boolean;

    static solve(
      cards: string[],
      game?: string | Game,
      canDisqualify?: boolean,
    ): Hand;
    static winners(hands: Hand[]): Hand[];
  }

  export class PaiGowPokerHelper {
    static solve(cards: string[]): PaiGowPokerHelper;
    hiHand: Hand;
    loHand: Hand;
  }

  export class RoyalFlush extends Hand {}
  export class NaturalRoyalFlush extends Hand {}
  export class WildRoyalFlush extends Hand {}
  export class FiveOfAKind extends Hand {}
  export class StraightFlush extends Hand {}
  export class FourOfAKindPairPlus extends Hand {}
  export class FourOfAKind extends Hand {}
  export class FourWilds extends Hand {}
  export class TwoThreeOfAKind extends Hand {}
  export class ThreeOfAKindTwoPair extends Hand {}
  export class FullHouse extends Hand {}
  export class Flush extends Hand {}
  export class Straight extends Hand {}
  export class ThreeOfAKind extends Hand {}
  export class ThreePair extends Hand {}
  export class TwoPair extends Hand {}
  export class OnePair extends Hand {}
  export class HighCard extends Hand {}
}