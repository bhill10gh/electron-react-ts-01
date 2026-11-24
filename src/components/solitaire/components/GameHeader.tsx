interface Props {
  onNewGame: () => void;
}

export default function GameHeader({ onNewGame }: Props) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">♠ Solitaire</h1>
        <p className="text-emerald-200 text-sm mt-1">
          Classic Klondike Card Game
        </p>
      </div>

      <button
        onClick={onNewGame}
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 py-3 rounded-lg"
      >
        New Game
      </button>
    </div>
  );
}
