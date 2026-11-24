import type { Card, Selection } from "../types/solitaire";
import CardView from "./CardView";

interface Props {
  cards: Card[];
  columnIndex: number;
  selection: Selection | null;
  onSelect: (cardIndex: number) => void;
  onEmptyClick: () => void;
}

export default function TableauColumn({
  cards,
  columnIndex,
  selection,
  onSelect,
  onEmptyClick,
}: Props) {
  return (
    <div className="min-w-0">
      <div className="relative min-h-64">
        {cards.length === 0 && (
          <div
            onClick={onEmptyClick}
            className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg border-2 border-white/30"
          />
        )}

        {cards.map((card, cardIndex) => (
          <div
            key={card.id}
            className="absolute left-0"
            style={{
              top: `${cardIndex * 25}px`,
              zIndex: cardIndex,
            }}
          >
            <CardView
              card={card}
              selected={
                selection?.pile === "tableau" &&
                selection.pileIndex === columnIndex &&
                cardIndex >= selection.cardIndex
              }
              onClick={() => onSelect(cardIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
