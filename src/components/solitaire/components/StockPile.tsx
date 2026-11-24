import CardView from "./CardView";

interface Props {
  count: number;
  onClick: () => void;
}

export default function StockPile({ count, onClick }: Props) {
  return (
    <div>
      <p className="text-xs text-emerald-200 mb-2">STOCK</p>

      {count > 0 ? (
        <CardView
          card={{
            id: "stock",
            suit: "spades",
            rank: 1,
            faceUp: false,
          }}
          onClick={onClick}
        />
      ) : (
        <div
          onClick={onClick}
          className="w-16 h-24 sm:w-20 sm:h-28 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center text-2xl cursor-pointer"
        >
          ↻
        </div>
      )}
    </div>
  );
}
