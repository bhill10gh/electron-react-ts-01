import type { Card } from "../types/baccarat.types";
import PlayingCard from "./PlayingCard";

interface BaccaratHandProps {
  title: string;
  cards: Card[];
  score: number;
  color: string;
}

export default function BaccaratHand({
  title,
  cards,
  score,
  color,
}: BaccaratHandProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>

      <div
        className="flex min-h-36 flex-wrap
        justify-center gap-3"
      >
        {cards.map((card, index) => (
          <PlayingCard key={`${card.suit}-${card.rank}-${index}`} card={card} />
        ))}
      </div>

      <div className="rounded-lg bg-black/40 px-6 py-2">
        <span className="text-sm text-gray-300">TOTAL</span>

        <span className="ml-3 text-3xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
}
