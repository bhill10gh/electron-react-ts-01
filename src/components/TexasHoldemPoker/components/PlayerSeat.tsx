import { Player } from "../models/pokerTypes";
import PlayingCard from "./PlayingCard";

type Props = {
  player: Player;
  isCurrentPlayer?: boolean;
  showCards?: boolean;
};

export default function PlayerSeat({
  player,
  isCurrentPlayer = false,
  showCards = false,
}: Props) {
  return (
    <div
      className={`rounded-xl p-3 min-w-36 text-center border-2 ${
        isCurrentPlayer
          ? "border-yellow-400 bg-green-800"
          : "border-green-600 bg-green-950"
      }`}
    >
      <div className="font-bold text-white">
        {player.name}
        {player.isDealer && " 🔘"}
      </div>

      <div className="text-yellow-300 text-sm mt-1">${player.chips}</div>

      {player.folded ? (
        <div className="text-red-400 font-bold mt-3">FOLDED</div>
      ) : (
        <div className="flex justify-center gap-1 mt-3">
          {player.cards.map((card, index) => (
            <PlayingCard
              key={index}
              card={card}
              hidden={!player.isHuman && !showCards}
            />
          ))}
        </div>
      )}

      {player.bet > 0 && (
        <div className="text-yellow-200 text-sm mt-2">Bet: ${player.bet}</div>
      )}
    </div>
  );
}
