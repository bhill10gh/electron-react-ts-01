import type { Card } from "../types/solitaire";
import CardView from "./CardView";

interface Props {
  cards: Card[];
  index: number;
  onClick: () => void;
}

const symbols = ["♥", "♦", "♣", "♠"];

export default function FoundationPile({ cards, index, onClick }: Props) {
  return (
    <div>
      <p className="text-xs text-emerald-200 mb-2">{symbols[index]}</p>

      <CardView card={cards[cards.length - 1]} onClick={onClick} />
    </div>
  );
}
