import type { Card, Selection } from "../types/solitaire";
import CardView from "./CardView";

interface Props {
  cards: Card[];
  selection: Selection | null;
  onSelect: (cardIndex: number) => void;
}

export default function WastePile({ cards, selection, onSelect }: Props) {
  const visibleCards = cards.slice(-3);
  const startIndex = cards.length - visibleCards.length;

  return (
    <div>
      <p className="text-xs text-emerald-200 mb-2">WASTE</p>

      <div className="relative w-32 sm:w-40 h-28">
        {visibleCards.map((card, index) => {
          const cardIndex = startIndex + index;
          const isTopCard = cardIndex === cards.length - 1;

          return (
            <div
              key={card.id}
              className="absolute top-0"
              style={{
                left: `${index * 18}px`,
                zIndex: index,
              }}
            >
              <CardView
                card={card}
                selected={isTopCard && selection?.pile === "waste"}
                onClick={() => {
                  if (isTopCard) {
                    onSelect(cardIndex);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
