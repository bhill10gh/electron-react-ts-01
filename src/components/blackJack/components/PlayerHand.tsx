import type { Card } from "../types/blackjack";
import PlayingCard from "./PlayingCard";

interface PlayerHandProps {
  cards: Card[];
  score: number;
  title: string;
}

export default function PlayerHand({ cards, score, title }: PlayerHandProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((card) => (
          <PlayingCard key={card.id} card={card} />
        ))}
      </div>

      <div className="text-white text-lg font-semibold">Score: {score}</div>
    </div>
  );
}
