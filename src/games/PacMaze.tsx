import { useEffect, useState } from "react";

const MAP = [
  "#################",
  "#...............#",
  "#.###.###.###.#.#",
  "#...............#",
  "###.#.#####.#.###",
  "#...#...#...#...#",
  "#.#####.#.#####.#",
  "#...............#",
  "#################",
];
const WALLS = new Set<string>();
MAP.forEach((row, y) =>
  [...row].forEach((v, x) => {
    if (v === "#") WALLS.add(`${x},${y}`);
  }),
);
export default function PacMaze() {
  const [player, setPlayer] = useState({ x: 1, y: 1 }),
    [dots, setDots] = useState(() => new Set(MAP.flatMap((r, y) => [...r].flatMap((v, x) => (v === "." ? [`${x},${y}`] : []))))),
    [ghosts, setGhosts] = useState([
      { x: 15, y: 1 },
      { x: 15, y: 7 },
    ]),
    [over, setOver] = useState(false),
    [won, setWon] = useState(false);
  const move = (dx: number, dy: number) => {
    if (over || won) return;
    setPlayer((p) => {
      const n = { x: p.x + dx, y: p.y + dy };
      if (WALLS.has(`${n.x},${n.y}`)) return p;
      setDots((old) => {
        const d = new Set(old);
        d.delete(`${n.x},${n.y}`);
        if (d.size === 0) setWon(true);
        return d;
      });
      return n;
    });
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
      };
      if (m[e.key]) {
        e.preventDefault();
        move(...m[e.key]);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  useEffect(() => {
    if (over || won) return;
    const t = window.setInterval(() => {
      setGhosts((gs) =>
        gs.map((g) => {
          const opts = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]
            .map(([x, y]) => ({ x: g.x + x, y: g.y + y }))
            .filter((p) => !WALLS.has(`${p.x},${p.y}`));
          return opts[Math.floor(Math.random() * opts.length)] || g;
        }),
      );
    }, 650);
    return () => window.clearInterval(t);
  }, [over, won]);
  useEffect(() => {
    if (ghosts.some((g) => g.x === player.x && g.y === player.y)) {
      setOver(true);
    }
  }, [ghosts, player]);
  const reset = () => {
    setPlayer({ x: 1, y: 1 });
    setDots(new Set(MAP.flatMap((r, y) => [...r].flatMap((v, x) => (v === "." ? [`${x},${y}`] : [])))));
    setGhosts([
      { x: 15, y: 1 },
      { x: 15, y: 7 },
    ]);
    setOver(false);
    setWon(false);
  };
  return (
    <div className="game-wrap">
      <div className="mb-3 flex justify-between">
        <strong>Dots left: {dots.size}</strong>
        <span className="text-sm text-slate-400">Arrow keys / WASD to move</span>
      </div>
      <div className="maze-board">
        {MAP.map((row, y) =>
          [...row].map((v, x) => {
            const key = `${x},${y}`;
            const isPlayer = player.x === x && player.y === y;
            const ghost = ghosts.some((g) => g.x === x && g.y === y);
            return (
              <div key={key} className={`maze-cell ${v === "#" ? "maze-wall" : ""}`}>
                {isPlayer ? "😃" : ghost ? "👾" : dots.has(key) ? "·" : ""}
              </div>
            );
          }),
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="game-button" onClick={reset}>
          Restart
        </button>
        {over && <span className="self-center text-rose-300">Caught by a ghost!</span>}
        {won && <span className="self-center text-emerald-300">Maze cleared!</span>}
      </div>
    </div>
  );
}