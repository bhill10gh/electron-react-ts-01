//TexasHoldemPokerPage

import { useState } from "react";

import {
  createDeck,
  dealCards,
} from "../components/TexasHoldemPoker/utils/deck";
import { determineWinner } from "../components/TexasHoldemPoker/utils/poker";

import PokerTable from "../components/TexasHoldemPoker/components/PokerTable";
import PokerControls from "../components/TexasHoldemPoker/components/PokerControls";
import type {
  Card,
  Player,
  GameStage,
  PokerAction,
} from "../components/TexasHoldemPoker/models/pokerTypes";

const initialPlayers: Player[] = [
  {
    id: 1,
    name: "You",
    cards: [],
    chips: 1000,
    bet: 0,
    folded: false,
    isDealer: false,
    isHuman: true,
  },
  {
    id: 2,
    name: "Computer 1",
    cards: [],
    chips: 1000,
    bet: 0,
    folded: false,
    isDealer: true,
    isHuman: false,
  },
  {
    id: 3,
    name: "Computer 2",
    cards: [],
    chips: 1000,
    bet: 0,
    folded: false,
    isDealer: false,
    isHuman: false,
  },
  {
    id: 4,
    name: "Computer 3",
    cards: [],
    chips: 1000,
    bet: 0,
    folded: false,
    isDealer: false,
    isHuman: false,
  },
];

const stageNames: Record<GameStage, string> = {
  preflop: "Pre-Flop",
  flop: "Flop",
  turn: "Turn",
  river: "River",
  showdown: "Showdown",
};

export default function TexasHoldemPokerPage() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const [deck, setDeck] = useState<Card[]>([]);

  const [communityCards, setCommunityCards] = useState<Card[]>([]);

  const [pot, setPot] = useState(0);

  const [stage, setStage] = useState<GameStage>("showdown");

  const [message, setMessage] = useState("Start a new game!");

  const [winners, setWinners] = useState<string[]>([]);

  const [gameStarted, setGameStarted] = useState(false);

  // --------------------------------
  // Start a new hand
  // --------------------------------

  function startNewHand() {
    const newDeck = createDeck();

    const newPlayers = players.map((player) => ({
      ...player,
      cards: dealCards(newDeck, 2),
      bet: 0,
      folded: false,
    }));

    setDeck(newDeck);
    setPlayers(newPlayers);
    setCommunityCards([]);
    setPot(0);
    setStage("preflop");
    setWinners([]);
    setMessage("Your turn! Choose an action.");
    setGameStarted(true);
  }

  // --------------------------------
  // Finish hand
  // --------------------------------

  function finishHand(
    currentPlayers: Player[],
    currentBoard: Card[],
    currentPot: number,
  ) {
    const winningNames = determineWinner(currentPlayers, currentBoard);

    const winningPlayers = currentPlayers.filter((player) =>
      winningNames.includes(player.name),
    );

    const share = winningPlayers.length
      ? Math.floor(currentPot / winningPlayers.length)
      : 0;

    const updatedPlayers = currentPlayers.map((player) => {
      if (winningNames.includes(player.name)) {
        return {
          ...player,
          chips: player.chips + share,
        };
      }

      return player;
    });

    setPlayers(updatedPlayers);
    setWinners(winningNames);
    setStage("showdown");

    setMessage(
      winningNames.length > 0
        ? `${winningNames.join(", ")} won $${currentPot}!`
        : "Hand complete.",
    );
  }

  // --------------------------------
  // Player action
  // --------------------------------

  function handleAction(action: PokerAction) {
    if (stage === "showdown") return;

    const updatedPlayers = players.map((player) => ({
      ...player,
    }));

    const human = updatedPlayers[0];

    let addedToPot = 0;

    if (action === "fold") {
      human.folded = true;

      setMessage("You folded.");
    } else if (action === "call") {
      const amount = Math.min(10, human.chips);

      human.chips -= amount;
      human.bet += amount;
      addedToPot += amount;

      setMessage("You called.");
    } else if (action === "raise") {
      const amount = Math.min(30, human.chips);

      human.chips -= amount;
      human.bet += amount;
      addedToPot += amount;

      setMessage("You raised!");
    } else {
      setMessage("You checked.");
    }

    // Simulate computer players.
    updatedPlayers.slice(1).forEach((player) => {
      if (player.folded || player.chips <= 0) return;

      // Simple computer decision.
      if (Math.random() < 0.12) {
        player.folded = true;
        return;
      }

      const amount = Math.min(10, player.chips);

      player.chips -= amount;
      player.bet += amount;
      addedToPot += amount;
    });

    const newPot = pot + addedToPot;

    const activePlayers = updatedPlayers.filter((player) => !player.folded);

    setPlayers(updatedPlayers);
    setPot(newPot);

    // Only one player remains.
    if (activePlayers.length === 1) {
      finishHand(updatedPlayers, communityCards, newPot);
      return;
    }

    // Advance the game.
    if (stage === "preflop") {
      const flop = dealCards(deck, 3);

      const newBoard = [...communityCards, ...flop];

      setDeck([...deck]);
      setCommunityCards(newBoard);
      setStage("flop");
    } else if (stage === "flop") {
      const turn = dealCards(deck, 1);

      const newBoard = [...communityCards, ...turn];

      setDeck([...deck]);
      setCommunityCards(newBoard);
      setStage("turn");
    } else if (stage === "turn") {
      const river = dealCards(deck, 1);

      const newBoard = [...communityCards, ...river];

      setDeck([...deck]);
      setCommunityCards(newBoard);
      setStage("river");
    } else if (stage === "river") {
      finishHand(updatedPlayers, communityCards, newPot);
    }
  }

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <div
      className="min-h-screen bg-gray-950
      text-white p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div
          className="flex justify-between
          items-center mb-8"
        >
          <h1
            className="text-3xl md:text-4xl
            font-bold text-yellow-400"
          >
            Texas Hold'em
          </h1>

          <button
            onClick={startNewHand}
            className="bg-yellow-500 hover:bg-yellow-600
              text-black px-5 py-3 rounded-lg
              font-bold"
          >
            New Hand
          </button>
        </div>

        {/* Game Stage */}

        <div className="text-center mb-4">
          <div
            className="text-yellow-300
            text-xl font-bold"
          >
            {stageNames[stage]}
          </div>

          <div className="text-gray-300 mt-2">{message}</div>
        </div>

        {/* Poker Table */}

        <PokerTable
          players={players}
          communityCards={communityCards}
          pot={pot}
          revealCards={stage === "showdown"}
        />

        {/* Game Controls */}

        <div className="mt-8">
          {stage !== "showdown" && gameStarted && (
            <PokerControls onAction={handleAction} />
          )}

          {stage === "showdown" && gameStarted && (
            <div className="text-center">
              <div
                className="text-xl
                text-yellow-400 font-bold mb-4"
              >
                {winners.length > 0
                  ? `Winner: ${winners.join(", ")}`
                  : "Hand finished"}
              </div>

              <button
                onClick={startNewHand}
                className="bg-green-600
                  hover:bg-green-700 px-8 py-3
                  rounded-lg font-bold"
              >
                Deal Again
              </button>
            </div>
          )}

          {!gameStarted && (
            <div className="text-center">
              <button
                onClick={startNewHand}
                className="bg-green-600 hover:bg-green-700
                  px-8 py-3 rounded-lg font-bold"
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* Player Balances */}

        <div
          className="mt-10 bg-gray-900
          rounded-xl p-5"
        >
          <h2 className="text-xl font-bold mb-4">Player Balances</h2>

          <div
            className="grid grid-cols-2
            md:grid-cols-4 gap-4"
          >
            {players.map((player) => (
              <div key={player.id} className="bg-gray-800 rounded-lg p-4">
                <div className="text-gray-300">{player.name}</div>

                <div
                  className="text-yellow-400
                  text-xl font-bold"
                >
                  ${player.chips}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
