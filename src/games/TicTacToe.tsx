import { useEffect, useMemo, useState } from "react";

type Mark = "X" | "O" | null;
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function winner(board: Mark[]) {
  for (const [a, b, c] of wins) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return null;
}
export default function TicTacToe() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [mode, setMode] = useState<"friend" | "computer">("computer");
  const result = winner(board);
  const draw = !result && board.every(Boolean);
  const computerMove = useMemo(() => {
    if (mode !== "computer" || turn !== "O" || result || draw) return -1;
    const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    const findWinningMove = (mark: Mark) =>
      empty.find((i) => {
        const next = [...board];
        next[i] = mark;
        return winner(next) === mark;
      });
    return (
      findWinningMove("O") ??
      findWinningMove("X") ??
      (board[4] === null ? 4 : empty[Math.floor(Math.random() * empty.length)] ?? -1)
    );
  }, [board, turn, mode, result, draw]);

  useEffect(() => {
    if (computerMove < 0) return;
    const timer = window.setTimeout(() => {
      setBoard((current) => {
        if (current[computerMove] || winner(current)) return current;
        const next = [...current];
        next[computerMove] = "O";
        return next;
      });
      setTurn("X");
    }, 250);
    return () => window.clearTimeout(timer);
  }, [computerMove]);

  const play = (index: number) => {
    if (board[index] || result || draw || (mode === "computer" && turn === "O")) return;
    const next = [...board];
    next[index] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  };
  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
  };
  return (
    <div className="game-wrap text-center">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <label className="text-sm text-slate-300">Mode</label>
        <select
          className="rounded-lg bg-slate-800 px-3 py-2"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as "friend" | "computer");
            reset();
          }}
        >
          <option value="computer">Vs computer</option>
          <option value="friend">Two players</option>
        </select>
        <span className="text-sm text-slate-400">X goes first</span>
      </div>
      <div className="tic-board">
        {board.map((value, index) => (
          <button
            key={index}
            type="button"
            className={`tic-cell ${value === "X" ? "text-cyan-300" : "text-fuchsia-300"}`}
            onClick={() => play(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="my-4 font-semibold">{result ? `${result} wins!` : draw ? "It's a draw!" : `${turn}'s turn`}</p>
      <button type="button" className="game-button" onClick={reset}>
        New game
      </button>
    </div>
  );
}