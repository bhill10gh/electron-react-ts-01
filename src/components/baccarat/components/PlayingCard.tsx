import type { Card } from "../types/baccarat.types";

interface PlayingCardProps {
  card: Card;
  hidden?: boolean;
}

export default function PlayingCard({
  card,
  hidden = false,
}: PlayingCardProps) {
  if (hidden) {
    return (
      <div
        className="flex h-28 w-20 items-center justify-center
        rounded-xl border-4 border-white bg-blue-900
        shadow-lg sm:h-36 sm:w-24"
      >
        <span className="text-4xl text-white">♠</span>
      </div>
    );
  }

  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  const symbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  return (
    <div
      className={`flex h-28 w-20 flex-col justify-between
      rounded-xl border border-gray-300 bg-white p-2
      shadow-lg sm:h-36 sm:w-24
      ${isRed ? "text-red-600" : "text-gray-900"}`}
    >
      <div className="text-left text-xl font-bold">
        {card.rank}
        <div className="text-lg">{symbols[card.suit]}</div>
      </div>

      <div className="text-center text-4xl">{symbols[card.suit]}</div>

      <div className="rotate-180 text-right text-xl font-bold">
        {card.rank}
        <div className="text-lg">{symbols[card.suit]}</div>
      </div>
    </div>
  );
}
