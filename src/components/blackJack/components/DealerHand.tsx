import type { Card } from "../types/blackjack";
import PlayingCard from "./PlayingCard";

interface DealerHandProps {
  cards: Card[];
  score: number;
  hideFirstCard: boolean;
}

export default function DealerHand({
  cards,
  score,
  hideFirstCard,
}: DealerHandProps) {
  const displayScore = hideFirstCard ? "?" : score;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-white">Dealer</h2>

      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((card, index) => (
          <PlayingCard
            key={card.id}
            card={card}
            hidden={hideFirstCard && index === 0}
          />
        ))}
      </div>

      <div className="text-white text-lg font-semibold">
        Score: {displayScore}
      </div>
    </div>
  );
}
