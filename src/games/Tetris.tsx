import { useCallback, useEffect, useState } from "react";

const W = 10,
  H = 18;
const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];
const COLORS = ["#38bdf8", "#facc15", "#c084fc", "#fb923c", "#60a5fa", "#4ade80", "#f87171"];
type Piece = { shape: number[][]; x: number; y: number; color: string };
const makePiece = (): Piece => {
  const i = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[i].map((r) => [...r]), x: 3, y: 0, color: COLORS[i] };
};
const empty = () => Array.from({ length: H }, () => Array(W).fill(""));

export default function Tetris() {
  const [board, setBoard] = useState<string[][]>(empty);
  const [piece, setPiece] = useState<Piece>(makePiece);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);

  const collides = useCallback(
    (p: Piece, b: string[][]) =>
      p.shape.some((row, dy) =>
        row.some(
          (v, dx) => v && (p.x + dx < 0 || p.x + dx >= W || p.y + dy >= H || (p.y + dy >= 0 && b[p.y + dy][p.x + dx])),
        ),
      ),
    [],
  );
  const lock = useCallback((p: Piece, b: string[][]) => {
    const next = b.map((r) => [...r]);
    p.shape.forEach((row, dy) =>
      row.forEach((v, dx) => {
        if (v && p.y + dy >= 0) next[p.y + dy][p.x + dx] = p.color;
      }),
    );
    const kept = next.filter((row) => row.some((v) => !v));
    const cleared = H - kept.length;
    return {
      board: [...Array.from({ length: cleared }, () => Array(W).fill("")), ...kept],
      cleared,
    };
  }, []);
  const reset = () => {
    setBoard(empty());
    setPiece(makePiece());
    setScore(0);
    setOver(false);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || over) return;
    const timer = window.setInterval(() => {
      setPiece((p) => {
        const down = { ...p, y: p.y + 1 };
        if (!collides(down, board)) return down;
        const result = lock(p, board);
        setBoard(result.board);
        setScore((s) => s + [0, 100, 300, 500, 800][result.cleared]);
        const next = makePiece();
        if (collides(next, result.board)) {
          setOver(true);
          setRunning(false);
        }
        return next;
      });
    }, 550);
    return () => window.clearInterval(timer);
  }, [running, over, board, collides, lock]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(e.key)) e.preventDefault();
      if (e.key === " ") {
        setRunning((v) => !v);
        return;
      }
      setPiece((p) => {
        let n = { ...p };
        if (e.key === "ArrowLeft") n.x--;
        if (e.key === "ArrowRight") n.x++;
        if (e.key === "ArrowDown") n.y++;
        if (e.key === "ArrowUp") n.shape = p.shape[0].map((_, i) => p.shape.map((row) => row[i]).reverse());
        return collides(n, board) ? p : n;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, collides]);

  const display = board.map((r) => [...r]);
  piece.shape.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (v && piece.y + dy >= 0 && piece.y + dy < H && piece.x + dx >= 0 && piece.x + dx < W)
        display[piece.y + dy][piece.x + dx] = piece.color;
    }),
  );
  return (
    <div className="game-wrap">
      <div className="mb-3 flex justify-between">
        <strong>Score: {score}</strong>
        <span className="text-sm text-slate-400">← → move · ↑ rotate · ↓ drop · Space pause</span>
      </div>
      <div className="tetris-board">
        {display.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="tetris-cell"
              style={{ background: cell || undefined, borderColor: cell || "#263449" }}
            />
          )),
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="game-button" onClick={reset}>
          Start / Restart
        </button>
        <button type="button" className="game-button secondary" onClick={() => setRunning((v) => !v)} disabled={over}>
          {running ? "Pause" : "Resume"}
        </button>
        {over && <span className="self-center text-rose-300">Game over!</span>}
      </div>
    </div>
  );
}