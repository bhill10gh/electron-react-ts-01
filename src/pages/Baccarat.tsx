import { useState } from "react";

import BaccaratHand from "../components/baccarat/components/BaccaratHand";
import BettingPanel from "../components/baccarat/components/BettingPanel";
import GameHistory from "../components/baccarat/components/GameHistory";

import { dealCards } from "../components/baccarat/utils/baccarat";

import type {
  BetType,
  Card,
  GameRound,
} from "../components/baccarat/types/baccarat.types";

const STARTING_BALANCE = 1000;

export default function Baccarat() {
  const [balance, setBalance] = useState(STARTING_BALANCE);

  const [bet, setBet] = useState<BetType>("player");

  const [amount, setAmount] = useState(25);

  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [bankerCards, setBankerCards] = useState<Card[]>([]);

  const [playerScore, setPlayerScore] = useState(0);
  const [bankerScore, setBankerScore] = useState(0);

  const [winner, setWinner] = useState<BetType | null>(null);
  const [lastPayout, setLastPayout] = useState(0);

  const [history, setHistory] = useState<GameRound[]>([]);

  const [stats, setStats] = useState({
    player: 0,
    banker: 0,
    tie: 0,
  });

  function handleDeal() {
    if (amount <= 0 || !Number.isInteger(amount) || amount > balance) {
      return;
    }

    const result = dealCards();

    let payout = 0;

    // Determine how much is returned to the player.
    if (bet === result.result) {
      if (bet === "player") {
        payout = amount * 2;
      } else if (bet === "banker") {
        payout = amount * 1.95;
      } else {
        payout = amount * 9;
      }
    } else if (result.result === "tie" && bet !== "tie") {
      // Player and Banker bets push on a tie.
      payout = amount;
    }

    const round: GameRound = {
      playerCards: result.playerCards,
      bankerCards: result.bankerCards,
      playerScore: result.playerScore,
      bankerScore: result.bankerScore,
      result: result.result,
      bet,
      betAmount: amount,
      payout,
    };

    setBalance((prev) => prev - amount + payout);

    setPlayerCards(result.playerCards);
    setBankerCards(result.bankerCards);

    setPlayerScore(result.playerScore);
    setBankerScore(result.bankerScore);

    setWinner(result.result);
    setLastPayout(payout);

    setHistory((prev) => [round, ...prev]);

    setStats((prev) => ({
      ...prev,
      [result.result]: prev[result.result] + 1,
    }));
  }

  function handleNewRound() {
    setPlayerCards([]);
    setBankerCards([]);

    setPlayerScore(0);
    setBankerScore(0);

    setWinner(null);
    setLastPayout(0);
  }

  function handleReset() {
    setBalance(STARTING_BALANCE);
    setAmount(25);
    setBet("player");

    setPlayerCards([]);
    setBankerCards([]);

    setPlayerScore(0);
    setBankerScore(0);

    setWinner(null);
    setLastPayout(0);

    setHistory([]);

    setStats({
      player: 0,
      banker: 0,
      tie: 0,
    });
  }

  const netResult = lastPayout - amount;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header
        className="border-b border-yellow-500/30
        bg-gray-900 px-4 py-5"
      >
        <div
          className="mx-auto flex max-w-6xl
          flex-wrap items-center justify-between gap-3"
        >
          <h1
            className="text-3xl font-extrabold
            tracking-widest text-yellow-400"
          >
            ROYAL BACCARAT
          </h1>

          <div
            className="rounded-lg border border-green-500/40
            bg-gray-800 px-5 py-2"
          >
            <span className="text-sm text-gray-400">YOUR BALANCE</span>

            <div className="text-2xl font-bold text-green-400">
              ${balance.toFixed(2)}
            </div>
          </div>
        </div>
      </header>

      <main
        className="mx-auto flex max-w-6xl
        flex-col items-center gap-8 px-4 py-8"
      >
        {/* Game Table */}
        <section
          className="w-full rounded-3xl
          border-4 border-yellow-700/50
          bg-gradient-to-br from-green-800 to-green-950
          p-5 shadow-2xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <h2
              className="text-xl font-bold
              tracking-widest text-yellow-300"
            >
              BACCARAT TABLE
            </h2>

            <p className="mt-1 text-sm text-green-200">Player vs Banker</p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <BaccaratHand
              title="PLAYER"
              cards={playerCards}
              score={playerScore}
              color="text-blue-300"
            />

            <BaccaratHand
              title="BANKER"
              cards={bankerCards}
              score={bankerScore}
              color="text-red-300"
            />
          </div>

          {/* Winner Display */}
          {winner && (
            <div
              className="mt-10 rounded-xl border
              border-yellow-400 bg-black/40 p-5 text-center"
            >
              <h2
                className="text-3xl font-extrabold
                uppercase text-yellow-400"
              >
                {winner === "tie" ? "It's a Tie!" : `${winner} Wins!`}
              </h2>

              <p className="mt-2 text-gray-300">
                Your bet: {bet.toUpperCase()}
              </p>

              <p
                className={`mt-2 text-xl font-bold
                ${
                  netResult > 0
                    ? "text-green-400"
                    : netResult < 0
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              >
                {netResult > 0
                  ? `You won $${netResult.toFixed(2)}`
                  : netResult < 0
                    ? `You lost $${Math.abs(netResult).toFixed(2)}`
                    : "Your bet was returned"}
              </p>

              <button
                onClick={handleNewRound}
                className="mt-5 rounded-lg bg-yellow-500
                  px-8 py-3 font-bold text-black
                  hover:bg-yellow-400"
              >
                NEXT ROUND
              </button>
            </div>
          )}

          {!winner && playerCards.length === 0 && (
            <div className="mt-8 text-center text-green-200">
              Place your bet and deal the cards!
            </div>
          )}
        </section>

        {/* Betting */}
        <BettingPanel
          bet={bet}
          setBet={setBet}
          amount={amount}
          setAmount={setAmount}
          balance={balance}
          onDeal={handleDeal}
          disabled={balance < 1}
        />

        {/* Statistics */}
        <section
          className="w-full max-w-2xl rounded-xl
          border border-gray-700 bg-gray-900 p-5"
        >
          <h2
            className="mb-4 text-center text-lg
            font-bold text-yellow-400"
          >
            GAME STATISTICS
          </h2>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-blue-950 p-3">
              <div className="text-sm text-blue-300">Player Wins</div>
              <div className="text-2xl font-bold">{stats.player}</div>
            </div>

            <div className="rounded-lg bg-red-950 p-3">
              <div className="text-sm text-red-300">Banker Wins</div>
              <div className="text-2xl font-bold">{stats.banker}</div>
            </div>

            <div className="rounded-lg bg-green-950 p-3">
              <div className="text-sm text-green-300">Ties</div>
              <div className="text-2xl font-bold">{stats.tie}</div>
            </div>
          </div>
        </section>

        {/* History */}
        <GameHistory history={history} />

        {/* Reset */}
        <button
          onClick={handleReset}
          className="rounded-lg border border-red-500
            px-6 py-3 font-bold text-red-400
            transition hover:bg-red-500 hover:text-white"
        >
          RESET GAME
        </button>
      </main>

      <footer
        className="border-t border-gray-800
        py-5 text-center text-sm text-gray-500"
      >
        Royal Baccarat | Virtual Chips Only
      </footer>
    </div>
  );
}
