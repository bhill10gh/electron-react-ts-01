import type { GameRound } from "../types/baccarat.types";

interface GameHistoryProps {
  history: GameRound[];
}

export default function GameHistory({ history }: GameHistoryProps) {
  return (
    <div
      className="w-full max-w-2xl rounded-xl
      border border-gray-700 bg-gray-900 p-5"
    >
      <h2 className="mb-4 text-lg font-bold text-yellow-400">GAME HISTORY</h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">No games played yet.</p>
      ) : (
        <div className="space-y-2">
          {history.map((game, index) => (
            <div
              key={index}
              className="flex items-center justify-between
                rounded-lg bg-gray-800 p-3 text-sm"
            >
              <span className="text-gray-400">
                Round {history.length - index}
              </span>

              <span
                className={`font-bold uppercase
                ${
                  game.result === "player"
                    ? "text-blue-400"
                    : game.result === "banker"
                      ? "text-red-400"
                      : "text-green-400"
                }`}
              >
                {game.result}
              </span>

              <span className="text-gray-300">
                {game.playerScore} - {game.bankerScore}
              </span>

              <span className="text-yellow-400">${game.betAmount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
