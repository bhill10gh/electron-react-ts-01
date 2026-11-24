import { useEffect, useState } from "react";

type Enemy = { x: number; y: number };
type Shot = { x: number; y: number };
const makeEnemies = (): Enemy[] =>
  Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => ({ x: 35 + c * 48, y: 30 + r * 34 })),
  ).flat();

export default function SpaceInvaders() {
  const [player, setPlayer] = useState(175);
  const [enemies, setEnemies] = useState<Enemy[]>(makeEnemies);
  const [shots, setShots] = useState<Shot[]>([]);
  const [enemyShots, setEnemyShots] = useState<Shot[]>([]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);

  const reset = () => {
    setPlayer(175);
    setEnemies(makeEnemies());
    setShots([]);
    setEnemyShots([]);
    setScore(0);
    setOver(false);
    setWon(false);
    setRunning(true);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPlayer((p) => Math.max(8, p - 18));
      if (e.key === "ArrowRight") setPlayer((p) => Math.min(342, p + 18));
      if (e.key === " ") {
        e.preventDefault();
        if (running) setShots((s) => [...s, { x: player + 12, y: 350 }]);
        else if (!over) setRunning(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [player, running, over]);

  useEffect(() => {
    if (!running || over) return;
    const timer = window.setInterval(() => {
      setShots((currentShots) => {
        const movedShots = currentShots.map((s) => ({ ...s, y: s.y - 12 })).filter((s) => s.y > 0);
        setEnemies((currentEnemies) => {
          const movedEnemies = currentEnemies.map((e) => ({
            x: Math.max(5, Math.min(350, e.x + (Math.random() > 0.5 ? 3 : -3))),
            y: e.y + (Math.random() > 0.94 ? 5 : 0),
          }));
          const remaining = movedEnemies.filter(
            (enemy) => !movedShots.some((shot) => Math.abs(enemy.x - shot.x) < 17 && Math.abs(enemy.y - shot.y) < 18),
          );
          const hits = movedEnemies.length - remaining.length;
          if (hits) {
            setScore((s) => s + hits * 10);
            setShots((s) =>
              s.filter(
                (shot) =>
                  !movedEnemies.some((enemy) => Math.abs(enemy.x - shot.x) < 17 && Math.abs(enemy.y - shot.y) < 18),
              ),
            );
          }
          if (remaining.length === 0) {
            setWon(true);
            setOver(true);
            setRunning(false);
          }
          if (remaining.some((e) => e.y > 325)) {
            setOver(true);
            setRunning(false);
          }
          return remaining;
        });
        return movedShots;
      });
      setEnemyShots((current) => {
        const moved = current.map((s) => ({ ...s, y: s.y + 7 })).filter((s) => s.y < 390);
        if (moved.some((s) => s.y > 350 && Math.abs(s.x - player) < 25)) {
          setOver(true);
          setRunning(false);
        }
        return moved;
      });
      if (Math.random() < 0.08) {
        setEnemies((current) => {
          if (!current.length) return current;
          const shooter = current[Math.floor(Math.random() * current.length)];
          setEnemyShots((shotsNow) => [...shotsNow, { x: shooter.x + 10, y: shooter.y + 12 }]);
          return current;
        });
      }
    }, 150);
    return () => window.clearInterval(timer);
  }, [running, over, player]);

  return (
    <div className="game-wrap">
      <div className="mb-3 flex justify-between">
        <strong>Score: {score}</strong>
        <span className="text-sm text-slate-400">← → move · Space shoot</span>
      </div>
      <div className="space-board">
        {enemies.map((e, i) => (
          <span key={i} className="alien" style={{ left: e.x, top: e.y }}>
            ◆
          </span>
        ))}
        {shots.map((s, i) => (
          <span key={`s${i}`} className="player-shot" style={{ left: s.x, top: s.y }} />
        ))}
        {enemyShots.map((s, i) => (
          <span key={`e${i}`} className="enemy-shot" style={{ left: s.x, top: s.y }} />
        ))}
        <span className="player-ship" style={{ left: player }}>
          ▲
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" className="game-button" onClick={reset}>
          Start / Restart
        </button>
        <button type="button" className="game-button secondary" onClick={() => setRunning((v) => !v)} disabled={over}>
          {running ? "Pause" : "Resume"}
        </button>
        {over && <span className="self-center text-rose-300">{won ? "You win!" : "Game over!"}</span>}
      </div>
      <p className="mt-2 text-xs text-slate-500">Use the arrow keys and space bar to defend your ship.</p>
    </div>
  );
}