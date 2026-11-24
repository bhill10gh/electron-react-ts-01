import { Card } from "../models/pokerTypes";

type Props = {
  card?: Card;
  hidden?: boolean;
};

export default function PlayingCard({ card, hidden = false }: Props) {
  if (hidden || !card) {
    return (
      <div
        className="w-16 h-24 rounded-lg border-2
        border-white bg-blue-800 shadow-lg
        flex items-center justify-center"
      >
        <div
          className="w-12 h-20 border border-white
          rounded flex items-center justify-center
          text-white text-2xl"
        >
          ♠
        </div>
      </div>
    );
  }

  const red = card.suit === "H" || card.suit === "D";

  const symbols: Record<string, string> = {
    S: "♠",
    H: "♥",
    D: "♦",
    C: "♣",
  };

  return (
    <div
      className="w-16 h-24 bg-white rounded-lg
      shadow-lg border border-gray-300
      flex flex-col justify-between p-2"
    >
      <span
        className={`font-bold text-lg ${red ? "text-red-600" : "text-black"}`}
      >
        {card.rank}
      </span>

      <span
        className={`text-3xl text-center ${
          red ? "text-red-600" : "text-black"
        }`}
      >
        {symbols[card.suit]}
      </span>
    </div>
  );
}
