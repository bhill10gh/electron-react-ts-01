interface GameControlsProps {
  status: string;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onNewGame: () => void;
  onNewRound: () => void;
  canDouble: boolean;
}

export default function GameControls({
  status,
  onHit,
  onStand,
  onDouble,
  onNewGame,
  onNewRound,
  canDouble,
}: GameControlsProps) {
  const playing = status === "playing";

  const buttonStyle =
    "px-6 py-3 rounded-lg font-bold text-white " +
    "transition hover:brightness-110 disabled:opacity-40 " +
    "disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {playing ? (
        <>
          <button onClick={onHit} className={`${buttonStyle} bg-blue-600`}>
            Hit
          </button>

          <button onClick={onStand} className={`${buttonStyle} bg-green-600`}>
            Stand
          </button>

          <button
            onClick={onDouble}
            disabled={!canDouble}
            className={`${buttonStyle} bg-orange-600`}
          >
            Double Down
          </button>
        </>
      ) : status === "betting" ? (
        <button onClick={onNewRound} className={`${buttonStyle} bg-green-600`}>
          Deal Cards
        </button>
      ) : (
        <>
          <button
            onClick={onNewRound}
            className={`${buttonStyle} bg-green-600`}
          >
            New Round
          </button>

          <button onClick={onNewGame} className={`${buttonStyle} bg-gray-600`}>
            Restart Game
          </button>
        </>
      )}
    </div>
  );
}
