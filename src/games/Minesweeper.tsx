import { useMemo, useState, type MouseEvent } from "react";

type Cell = { mine: boolean; open: boolean; flag: boolean };
const N = 9,
  MINES = 10;
function createBoard(): Cell[][] {
  const b = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => ({ mine: false, open: false, flag: false })),
  );
  let placed = 0;
  while (placed < MINES) {
    const x = Math.floor(Math.random() * N),
      y = Math.floor(Math.random() * N);
    if (!b[y][x].mine) {
      b[y][x].mine = true;
      placed++;
    }
  }
  return b;
}
export default function Minesweeper() {
  const [board, setBoard] = useState(createBoard),
    [lost, setLost] = useState(false),
    [won, setWon] = useState(false);
  const count = (x: number, y: number) => {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) if (board[y + dy]?.[x + dx]?.mine) n++;
    return n;
  };
  const reveal = (x: number, y: number) => {
    if (lost || won) return;
    const next = board.map((r) => r.map((c) => ({ ...c }))),
      cell = next[y][x];
    if (cell.open || cell.flag) return;
    cell.open = true;
    if (cell.mine) {
      setLost(true);
      next.forEach((r) => r.forEach((c) => {
        if (c.mine) c.open = true;
      }));
    } else if (count(x, y) === 0) {
      const queue: [number, number][] = [[x, y]];
      while (queue.length) {
        const [cx, cy] = queue.pop()!;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx,
              ny = cy + dy,
              c = next[ny]?.[nx];
            if (c && !c.open && !c.flag && !c.mine) {
              c.open = true;
              if (count(nx, ny) === 0) queue.push([nx, ny]);
            }
          }
      }
    }
    const opened = next.flat().filter((c) => c.open && !c.mine).length;
    if (opened === N * N - MINES) setWon(true);
    setBoard(next);
  };
  const flag = (e: MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (lost || won) return;
    setBoard((old) =>
      old.map((r, ry) => r.map((c, cx) => (ry === y && cx === x && !c.open ? { ...c, flag: !c.flag } : c))),
    );
  };
  const reset = () => {
    setBoard(createBoard());
    setLost(false);
    setWon(false);
  };
  const flags = useMemo(() => board.flat().filter((c) => c.flag).length, [board]);
  return (
    <div className="game-wrap">
      <div className="mb-3 flex items-center justify-between">
        <strong>Mines remaining: {MINES - flags}</strong>
        <span className="text-sm text-slate-400">Click reveal · Right-click flag</span>
      </div>
      <div className="mine-board">
        {board.map((row, y) =>
          row.map((cell, x) => {
            const n = count(x, y);
            return (
              <button
                key={`${x}-${y}`}
                type="button"
                onClick={() => reveal(x, y)}
                onContextMenu={(e) => flag(e, x, y)}
                className={`mine-cell ${cell.open ? "revealed" : ""} ${cell.mine && cell.open ? "mine-hit" : ""}`}
              >
                {cell.open ? (cell.mine ? "💣" : n || "") : cell.flag ? "🚩" : ""}
              </button>
            );
          }),
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="game-button" onClick={reset}>
          New game
        </button>
        {lost && <span className="self-center text-rose-300">You hit a mine!</span>}
        {won && <span className="self-center text-emerald-300">You cleared the board!</span>}
      </div>
    </div>
  );
}