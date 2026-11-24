import type { BetType } from "../types/baccarat.types";

interface BettingPanelProps {
  bet: BetType;
  setBet: (bet: BetType) => void;
  amount: number;
  setAmount: (amount: number) => void;
  balance: number;
  onDeal: () => void;
  disabled: boolean;
}

export default function BettingPanel({
  bet,
  setBet,
  amount,
  setAmount,
  balance,
  onDeal,
  disabled,
}: BettingPanelProps) {
  const bets: {
    value: BetType;
    label: string;
    color: string;
  }[] = [
    {
      value: "player",
      label: "PLAYER",
      color: "bg-blue-600",
    },
    {
      value: "banker",
      label: "BANKER",
      color: "bg-red-600",
    },
    {
      value: "tie",
      label: "TIE",
      color: "bg-green-600",
    },
  ];

  return (
    <div
      className="w-full max-w-2xl rounded-xl
      border border-yellow-500/40 bg-gray-900 p-5"
    >
      <h2
        className="mb-4 text-center text-xl
        font-bold text-yellow-400"
      >
        PLACE YOUR BET
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {bets.map((item) => (
          <button
            key={item.value}
            disabled={disabled}
            onClick={() => setBet(item.value)}
            className={`rounded-lg p-3 font-bold
              text-white transition
              ${item.color}
              ${
                bet === item.value
                  ? "ring-4 ring-yellow-300 scale-105"
                  : "opacity-70 hover:opacity-100"
              }
              disabled:cursor-not-allowed`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm text-gray-300">Bet Amount</label>

        <input
          type="number"
          min="1"
          max={balance}
          step="1"
          value={amount}
          disabled={disabled}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-600
            bg-gray-800 p-3 text-white outline-none
            focus:border-yellow-400"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[10, 25, 50, 100].map((value) => (
          <button
            key={value}
            disabled={disabled || value > balance}
            onClick={() => setAmount(value)}
            className="rounded-full border border-yellow-500
              px-4 py-2 text-sm font-bold text-yellow-400
              hover:bg-yellow-500 hover:text-black
              disabled:opacity-30"
          >
            ${value}
          </button>
        ))}
      </div>

      <button
        onClick={onDeal}
        disabled={
          disabled ||
          amount <= 0 ||
          amount > balance ||
          !Number.isInteger(amount)
        }
        className="mt-6 w-full rounded-lg bg-yellow-500
          py-4 text-xl font-extrabold text-black
          transition hover:bg-yellow-400
          disabled:cursor-not-allowed disabled:opacity-40"
      >
        DEAL CARDS
      </button>

      <div className="mt-4 text-center text-gray-400">
        Available Balance:
        <span className="ml-2 font-bold text-green-400">
          ${balance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
