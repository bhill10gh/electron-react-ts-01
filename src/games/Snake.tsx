import { useCallback, useEffect, useState } from "react";

type Point = { x: number; y: number };
const SIZE = 20;
const initialSnake: Point[] = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const randomFood = (snake: Point[]): Point => {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
};

export default function Snake() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState<Point>(() => randomFood(initialSnake));
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);

  const reset = useCallback(() => {
    setSnake(initialSnake);
    setFood(randomFood(initialSnake));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setOver(false);
    setRunning(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = keys[e.key];
      if (next) {
        e.preventDefault();
        setDirection((old) => (next.x === -old.x && next.y === -old.y ? old : next));
      }
      if (e.key === " " && !over) setRunning((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [over]);

  useEffect(() => {
    if (!running || over) return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = { x: current[0].x + direction.x, y: current[0].y + direction.y };
        const ate = head.x === food.x && head.y === food.y;
        const body = ate ? current : current.slice(0, -1);
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= SIZE ||
          head.y >= SIZE ||
          body.some((p) => p.x === head.x && p.y === head.y)
        ) {
          setOver(true);
          setRunning(false);
          return current;
        }
        const next = [head, ...current];
        if (!ate) next.pop();
        else {
          setScore((s) => s + 10);
          setFood(randomFood(next));
        }
        return next;
      });
    }, Math.max(75, 145 - score));
    return () => window.clearInterval(timer);
  }, [running, over, direction, food, score]);

  return (
    <div className="game-wrap">
      <div className="mb-3 flex items-center justify-between">
        <strong>Score: {score}</strong>
        <span className="text-sm text-slate-400">Arrow keys / WASD · Space to pause</span>
      </div>
      <div className="snake-board" role="img" aria-label="Snake game board">
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const x = i % SIZE,
            y = Math.floor(i / SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={isHead ? "snake-head" : isBody ? "snake-body" : isFood ? "snake-food" : "snake-cell"}
            />
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="game-button" onClick={reset}>
          {over ? "Play again" : "Start / Restart"}
        </button>
        <button
          type="button"
          className="game-button secondary"
          onClick={() => setRunning((v) => !v)}
          disabled={over || snake === initialSnake}
        >
          {running ? "Pause" : "Resume"}
        </button>
        {over && <span className="self-center text-rose-300">Game over!</span>}
      </div>
    </div>
  );
}