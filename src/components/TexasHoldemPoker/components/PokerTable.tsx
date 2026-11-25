import { Player, Card } from "../models/pokerTypes";
import type { HandDescription } from "../utils/poker";
import PlayerSeat from "./PlayerSeat";
import CommunityCards from "./CommunityCards";

type Props = {
  players: Player[];
  communityCards: Card[];
  pot: number;
  revealCards?: boolean;
  yourBestHand?: HandDescription | null;
  winnerHands?: Record<string, HandDescription>;
};

export default function PokerTable({
  players,
  communityCards,
  pot,
  revealCards = false,
  yourBestHand = null,
  winnerHands = {},
}: Props) {
  function seatHandProps(player: Player) {
    const winningHand = revealCards ? winnerHands[player.name] : undefined;

    if (winningHand) {
      return {
        bestHand: winningHand,
        bestHandLabel: "Winning hand",
      };
    }

    if (player.isHuman && yourBestHand) {
      return {
        bestHand: yourBestHand,
        bestHandLabel: "Your best hand",
      };
    }

    return {};
  }

  return (
    <div
      className="relative bg-green-800
      border-[12px] border-amber-950
      rounded-[180px] min-h-[520px]
      shadow-2xl p-8 flex flex-col
      justify-between"
    >
      {/* Top players */}
      <div className="flex justify-around">
        {players.slice(1, 3).map((player) => (
          <PlayerSeat
            key={player.id}
            player={player}
            showCards={revealCards}
            {...seatHandProps(player)}
          />
        ))}
      </div>

      {/* Community cards */}
      <div className="text-center py-6">
        <div className="text-yellow-200 font-bold text-xl mb-4">
          COMMUNITY CARDS
        </div>

        <CommunityCards cards={communityCards} />

        <div className="mt-6 text-white">
          <div className="text-sm uppercase">Total Pot</div>

          <div className="text-yellow-300 text-3xl font-bold">${pot}</div>
        </div>
      </div>

      {/* Bottom players */}
      <div className="flex justify-around">
        <PlayerSeat
          player={players[0]}
          isCurrentPlayer
          showCards={revealCards}
          {...seatHandProps(players[0])}
        />

        <PlayerSeat
          player={players[3]}
          showCards={revealCards}
          {...seatHandProps(players[3])}
        />
      </div>
    </div>
  );
}
