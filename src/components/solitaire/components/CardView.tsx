import type { Card } from "../types/solitaire";
import { isRed, rankNames, suitSymbols } from "../utils/solitaireUtils";

interface Props {
  card?: Card;
  selected?: boolean;
  onClick?: () => void;
}

export default function CardView({ card, selected = false, onClick }: Props) {
  if (!card) {
    return (
      <div
        onClick={onClick}
        className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-white/30"
      />
    );
  }

  if (!card.faceUp) {
    return (
      <div
        onClick={onClick}
        className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-4 border-white bg-blue-800 shadow-md cursor-pointer"
      >
        <div className="w-full h-full rounded border-2 border-blue-300 flex items-center justify-center text-blue-200 text-3xl">
          ✦
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg bg-white shadow-md border cursor-pointer select-none
        ${isRed(card.suit) ? "text-red-600" : "text-gray-900"}
        ${selected ? "ring-4 ring-yellow-400 -translate-y-2" : ""}
        transition-transform`}
    >
      <div className="absolute top-1 left-1 flex flex-col items-center">
        <span className="text-sm font-bold leading-none">
          {rankNames[card.rank]}
        </span>
        <span>{suitSymbols[card.suit]}</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-4xl">
        {suitSymbols[card.suit]}
      </div>

      <div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
        <span className="text-sm font-bold leading-none">
          {rankNames[card.rank]}
        </span>
        <span>{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
}
