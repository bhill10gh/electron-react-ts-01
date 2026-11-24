import type { Card } from "../types/blackjack";

interface PlayingCardProps {
  card?: Card;
  hidden?: boolean;
}

export default function PlayingCard({
  card,
  hidden = false,
}: PlayingCardProps) {
  if (hidden || !card) {
    return (
      <div
        className="w-21 h-32 rounded-xl border-2
        border-white bg-blue-800 shadow-lg
        flex items-center justify-center"
      >
        <div
          className="w-16 h-24 border-2
          border-blue-300 rounded-lg flex
          items-center justify-center text-3xl"
        >
          🂠
        </div>
      </div>
    );
  }

  const red = card.suit === "♥" || card.suit === "♦";

  return (
    <div
      className="w-21 h-32 bg-white rounded-xl
      shadow-lg border border-gray-300 p-2
      flex flex-col justify-between"
    >
      <div
        className={`font-bold text-xl
        ${red ? "text-red-600" : "text-gray-900"}`}
      >
        {card.rank}
        <div className="text-lg">{card.suit}</div>
      </div>

      <div
        className={`text-3xl text-center
        ${red ? "text-red-600" : "text-gray-900"}`}
      >
        {card.suit}
      </div>

      <div
        className={`font-bold text-xl text-right
        ${red ? "text-red-600" : "text-gray-900"}`}
      >
        {card.rank}
      </div>
    </div>
  );
}
