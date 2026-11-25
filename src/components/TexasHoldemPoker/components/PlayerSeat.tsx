import { Player } from "../models/pokerTypes";
import type { HandDescription } from "../utils/poker";
import PlayingCard from "./PlayingCard";

type Props = {
  player: Player;
  isCurrentPlayer?: boolean;
  showCards?: boolean;
  bestHand?: HandDescription | null;
  bestHandLabel?: string;
};

export default function PlayerSeat({
  player,
  isCurrentPlayer = false,
  showCards = false,
  bestHand = null,
  bestHandLabel = "Your best hand",
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

      {bestHand && !player.folded && (
        <div
          className="mt-3 rounded-lg border border-cyan-400/40
            bg-black/25 px-2 py-2 text-left"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300/90">
            {bestHandLabel}
          </div>
          <div className="text-sm font-bold text-cyan-100">{bestHand.name}</div>
          <div className="text-xs text-cyan-200/90">{bestHand.descr}</div>
        </div>
      )}
    </div>
  );
}
