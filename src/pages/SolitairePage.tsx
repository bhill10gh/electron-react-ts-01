import { useState } from "react";

import type {
  Card,
  GameState,
  Selection,
  PileType,
} from "../components/solitaire/types/solitaire";

import {
  newGame,
  canMoveToTableau,
  canMoveToFoundation,
} from "../components/solitaire/utils/solitaireUtils";

import GameHeader from "../components/solitaire/components/GameHeader";
import GameInfo from "../components/solitaire/components/GameInfo";
import CardView from "../components/solitaire/components/CardView";
import StockPile from "../components/solitaire/components/StockPile";
import WastePile from "../components/solitaire/components/WastePile";
import FoundationPile from "../components/solitaire/components/FoundationPile";
import TableauColumn from "../components/solitaire/components/TableauColumn";
import GameInstructions from "../components/solitaire/components/GameInstructions";
import WinDialog from "../components/solitaire/components/WinDialog";

export default function SolitairePage() {
  const [game, setGame] = useState<GameState>(() => newGame());
  const [selection, setSelection] = useState<Selection | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function startNewGame() {
    setGame(newGame());
    setSelection(null);
    setMoves(0);
    setWon(false);
  }

  function drawCard() {
    setSelection(null);

    setGame((previous) => {
      const next: GameState = {
        ...previous,
        stock: [...previous.stock],
        waste: [...previous.waste],
        tableau: previous.tableau,
        foundations: previous.foundations,
      };

      if (next.stock.length > 0) {
        // Draw up to three cards.
        const drawnCards = next.stock.splice(-3);

        // Make all drawn cards face up.
        next.waste.push(
          ...drawnCards.map((card) => ({
            ...card,
            faceUp: true,
          })),
        );
      } else {
        // Recycle the waste pile back into the stock.
        next.stock = [...next.waste].reverse().map((card) => ({
          ...card,
          faceUp: false,
        }));

        next.waste = [];
      }

      return next;
    });

    setMoves((m) => m + 1);
  }

  function getSelectedCards(current: GameState, selected: Selection): Card[] {
    switch (selected.pile) {
      case "waste":
        return current.waste.slice(selected.cardIndex);

      case "tableau":
        return current.tableau[selected.pileIndex].slice(selected.cardIndex);

      case "foundation":
        return current.foundations[selected.pileIndex].slice(
          selected.cardIndex,
        );

      default:
        return [];
    }
  }

  function removeCards(current: GameState, selected: Selection): Card[] {
    let cards: Card[] = [];

    if (selected.pile === "waste") {
      cards = current.waste.splice(selected.cardIndex);
    }

    if (selected.pile === "tableau") {
      const column = current.tableau[selected.pileIndex];

      cards = column.splice(selected.cardIndex);

      if (column.length > 0) {
        const top = column[column.length - 1];

        if (!top.faceUp) {
          column[column.length - 1] = {
            ...top,
            faceUp: true,
          };
        }
      }
    }

    if (selected.pile === "foundation") {
      cards = current.foundations[selected.pileIndex].splice(
        selected.cardIndex,
      );
    }

    return cards;
  }

  function selectCard(pile: PileType, pileIndex: number, cardIndex: number) {
    const selected: Selection = {
      pile,
      pileIndex,
      cardIndex,
    };

    if (!selection) {
      setSelection(selected);
      return;
    }

    if (
      selection.pile === pile &&
      selection.pileIndex === pileIndex &&
      selection.cardIndex === cardIndex
    ) {
      setSelection(null);
      return;
    }

    if (
      selection.pile === "stock" ||
      (selection.pile === "tableau" &&
        pile === "tableau" &&
        selection.pileIndex === pileIndex &&
        cardIndex < selection.cardIndex)
    ) {
      setSelection(selected);
      return;
    }

    moveCards(selected);
  }

  function moveCards(destination: Selection) {
    if (!selection) return;

    const selectedCards = getSelectedCards(game, selection);

    if (selectedCards.length === 0) {
      setSelection(null);
      return;
    }

    let valid = false;

    if (destination.pile === "tableau") {
      if (
        selection.pile !== "tableau" ||
        selection.pileIndex !== destination.pileIndex
      ) {
        valid = canMoveToTableau(
          selectedCards,
          game.tableau[destination.pileIndex],
        );
      }
    }

    if (
      destination.pile === "foundation" &&
      selectedCards.length === 1 &&
      (selection.pile === "waste" || selection.pile === "tableau")
    ) {
      valid = canMoveToFoundation(
        selectedCards[0],
        game.foundations[destination.pileIndex],
      );
    }

    if (!valid) {
      setSelection(destination);
      return;
    }

    const next: GameState = {
      stock: [...game.stock],
      waste: [...game.waste],
      tableau: game.tableau.map((column) => [...column]),
      foundations: game.foundations.map((pile) => [...pile]),
    };

    const cards = removeCards(next, selection);

    if (destination.pile === "tableau") {
      next.tableau[destination.pileIndex].push(...cards);
    }

    if (destination.pile === "foundation") {
      next.foundations[destination.pileIndex].push(...cards);
    }

    setGame(next);
    setSelection(null);
    setMoves((m) => m + 1);

    if (next.foundations.every((pile) => pile.length === 13)) {
      setWon(true);
    }
  }

  const completed = game.foundations.reduce(
    (total, pile) => total + pile.length,
    0,
  );

  return (
    <div className="min-h-screen bg-emerald-800 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <GameHeader onNewGame={startNewGame} />

        <GameInfo moves={moves} completed={completed} />

        {/* Stock, Waste and Foundations */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-10">
          <StockPile count={game.stock.length} onClick={drawCard} />

          <WastePile
            cards={game.waste}
            selection={selection}
            onSelect={(cardIndex) => {
              selectCard("waste", 0, cardIndex);
            }}
          />

          <div />

          {game.foundations.map((foundation, index) => (
            <FoundationPile
              key={index}
              cards={foundation}
              index={index}
              onClick={() => {
                if (selection) {
                  moveCards({
                    pile: "foundation",
                    pileIndex: index,
                    cardIndex: foundation.length,
                  });
                }
              }}
            />
          ))}
        </div>

        {/* Tableau */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {game.tableau.map((column, columnIndex) => (
            <TableauColumn
              key={columnIndex}
              cards={column}
              columnIndex={columnIndex}
              selection={selection}
              onSelect={(cardIndex) =>
                selectCard("tableau", columnIndex, cardIndex)
              }
              onEmptyClick={() => {
                if (selection) {
                  moveCards({
                    pile: "tableau",
                    pileIndex: columnIndex,
                    cardIndex: 0,
                  });
                }
              }}
            />
          ))}
        </div>

        <GameInstructions />

        <WinDialog open={won} onPlayAgain={startNewGame} />
      </div>
    </div>
  );
}
