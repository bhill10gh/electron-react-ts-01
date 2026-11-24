import { useState } from "react";

import type { Card, GameStatus } from "../types/blackjack";

import { createDeck, createHand, drawCard } from "../utils/blackjack";

import PlayerHand from "./PlayerHand";
import DealerHand from "./DealerHand";
import GameControls from "./GameControls";

export default function BlackjackTable() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);

  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);

  const [status, setStatus] = useState<GameStatus>("betting");

  const [message, setMessage] = useState("Place your bet and deal your cards!");

  const [doubledDown, setDoubledDown] = useState(false);

  const player = createHand(playerCards);
  const dealer = createHand(dealerCards);

  const gameOver = ["player-wins", "dealer-wins", "push", "blackjack"].includes(
    status,
  );

  // Start a new game
  function restartGame() {
    setDeck([]);
    setPlayerCards([]);
    setDealerCards([]);
    setBalance(1000);
    setBet(10);
    setStatus("betting");
    setDoubledDown(false);
    setMessage("Place your bet and deal your cards!");
  }

  // Finish the round and determine the winner
  function finishRound(
    finalPlayerCards: Card[],
    finalDealerCards: Card[],
    currentBet: number,
  ) {
    const playerHand = createHand(finalPlayerCards);
    const dealerHand = createHand(finalDealerCards);

    setPlayerCards(finalPlayerCards);
    setDealerCards(finalDealerCards);

    if (playerHand.isBust) {
      setStatus("dealer-wins");
      setMessage("You busted! Dealer wins.");
      return;
    }

    if (dealerHand.isBust) {
      setStatus("player-wins");
      setMessage("Dealer busted! You win!");
      setBalance((prev) => prev + currentBet * 2);
      return;
    }

    if (playerHand.score > dealerHand.score) {
      setStatus("player-wins");
      setMessage("You win!");
      setBalance((prev) => prev + currentBet * 2);
    } else if (playerHand.score < dealerHand.score) {
      setStatus("dealer-wins");
      setMessage("Dealer wins!");
    } else {
      setStatus("push");
      setMessage("Push! Your bet has been returned.");
      setBalance((prev) => prev + currentBet);
    }
  }

  // Dealer plays until reaching 17
  function playDealer(
    currentDeck: Card[],
    currentPlayerCards: Card[],
    currentDealerCards: Card[],
    currentBet: number,
  ) {
    let workingDeck = [...currentDeck];
    let workingDealer = [...currentDealerCards];

    while (createHand(workingDealer).score < 17) {
      const result = drawCard(workingDeck);

      workingDeck = result.deck;
      workingDealer = [...workingDealer, result.card];
    }

    setDeck(workingDeck);

    finishRound(currentPlayerCards, workingDealer, currentBet);
  }

  // Deal a new round
  function newRound() {
    if (balance < bet) {
      setMessage("Not enough chips to place this bet!");
      return;
    }

    let workingDeck = createDeck();

    const draw = () => {
      const result = drawCard(workingDeck);
      workingDeck = result.deck;
      return result.card;
    };

    const initialPlayer = [draw(), draw()];
    const initialDealer = [draw(), draw()];

    setDeck(workingDeck);
    setPlayerCards(initialPlayer);
    setDealerCards(initialDealer);
    setBalance((prev) => prev - bet);
    setDoubledDown(false);

    const playerHand = createHand(initialPlayer);
    const dealerHand = createHand(initialDealer);

    // Check for natural blackjack
    if (playerHand.isBlackjack || dealerHand.isBlackjack) {
      setDealerCards(initialDealer);

      if (playerHand.isBlackjack && dealerHand.isBlackjack) {
        setStatus("push");
        setMessage("Both have Blackjack! Push.");
        setBalance((prev) => prev + bet);
      } else if (playerHand.isBlackjack) {
        setStatus("blackjack");
        setMessage("BLACKJACK! You win 3:2!");
        setBalance((prev) => prev + bet * 2.5);
      } else {
        setStatus("dealer-wins");
        setMessage("Dealer has Blackjack!");
      }

      return;
    }

    setStatus("playing");
    setMessage("Your turn! Hit or Stand?");
  }

  // Take another card
  function hit() {
    if (status !== "playing") return;

    const result = drawCard(deck);
    const newCards = [...playerCards, result.card];

    setDeck(result.deck);
    setPlayerCards(newCards);

    const newHand = createHand(newCards);

    if (newHand.isBust) {
      setStatus("dealer-wins");
      setMessage("Bust! You went over 21.");
    } else if (newHand.score === 21) {
      playDealer(result.deck, newCards, dealerCards, bet);
    }
  }

  // Stand and let the dealer play
  function stand() {
    if (status !== "playing") return;

    setStatus("dealer");
    setMessage("Dealer's turn...");

    playDealer(deck, playerCards, dealerCards, bet);
  }

  // Double the original bet and take exactly one card
  function doubleDown() {
    if (status !== "playing" || playerCards.length !== 2 || balance < bet) {
      return;
    }

    const newBet = bet * 2;

    setBalance((prev) => prev - bet);
    setBet(newBet);
    setDoubledDown(true);

    const result = drawCard(deck);
    const newCards = [...playerCards, result.card];

    setDeck(result.deck);
    setPlayerCards(newCards);

    const newHand = createHand(newCards);

    if (newHand.isBust) {
      setStatus("dealer-wins");
      setMessage("Bust! You lost your double bet.");
    } else {
      setStatus("dealer");
      setMessage("Double Down! Dealer's turn...");
      playDealer(result.deck, newCards, dealerCards, newBet);
    }
  }

  function adjustBet(amount: number) {
    if (status !== "betting") return;

    setBet((prev) => {
      const next = prev + amount;

      if (next < 10 || next > balance) return prev;

      return next;
    });
  }

  const canDouble =
    status === "playing" && playerCards.length === 2 && balance >= bet;

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white
      flex flex-col items-center p-4"
    >
      <h1
        className="text-4xl font-extrabold mb-6
        text-yellow-400 tracking-wider"
      >
        BLACKJACK 21
      </h1>

      {/* Casino table */}
      <div
        className="w-full max-w-5xl min-h-[600px]
        rounded-[100px] border-[12px] border-yellow-900
        bg-green-800 shadow-2xl p-8 md:p-12
        flex flex-col justify-between"
      >
        {/* Dealer */}
        <DealerHand
          cards={dealerCards}
          score={dealer.score}
          hideFirstCard={status === "playing"}
        />

        {/* Game message */}
        <div className="text-center my-6">
          <div className="text-2xl font-bold text-yellow-300">{message}</div>

          {gameOver && (
            <div className="text-sm text-white/80 mt-2">Round complete</div>
          )}
        </div>

        {/* Player */}
        <PlayerHand
          cards={playerCards}
          score={player.score}
          title="Your Hand"
        />
      </div>

      {/* Betting and balance */}
      <div
        className="w-full max-w-3xl mt-8
        flex flex-wrap justify-around items-center gap-6"
      >
        <div className="text-center">
          <div className="text-gray-400 text-sm">CHIP BALANCE</div>

          <div className="text-3xl font-bold text-yellow-400">
            ${balance.toFixed(2)}
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-400 text-sm">CURRENT BET</div>

          <div className="text-3xl font-bold">${bet.toFixed(2)}</div>

          {status === "betting" && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => adjustBet(-10)}
                className="bg-gray-700 px-4 py-2 rounded-lg"
              >
                -10
              </button>

              <button
                onClick={() => adjustBet(10)}
                className="bg-gray-700 px-4 py-2 rounded-lg"
              >
                +10
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8">
        <GameControls
          status={status}
          onHit={hit}
          onStand={stand}
          onDouble={doubleDown}
          onNewGame={restartGame}
          onNewRound={newRound}
          canDouble={canDouble}
        />
      </div>

      {doubledDown && (
        <p className="text-yellow-400 text-sm mt-4">Double Down Active</p>
      )}
    </div>
  );
}
