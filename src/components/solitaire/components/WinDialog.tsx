interface Props {
  open: boolean;
  onPlayAgain: () => void;
}

export default function WinDialog({ open, onPlayAgain }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 p-8 rounded-2xl text-center shadow-2xl">
        <div className="text-5xl mb-4">🏆</div>

        <h2 className="text-3xl font-bold mb-2">You Won!</h2>

        <p className="mb-6">Congratulations! You completed Solitaire.</p>

        <button
          onClick={onPlayAgain}
          className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
