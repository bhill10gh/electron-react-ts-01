import { useEffect, useRef, useState } from "react";

type Enemy = {
  x: number;
  y: number;
  speed: number;
  color: string;
};

type Bullet = {
  x: number;
  y: number;
};

type Oil = {
  x: number;
  y: number;
};

type GameState = {
  playerX: number;
  enemies: Enemy[];
  bullets: Bullet[];
  oils: Oil[];
  score: number;
  lives: number;
  roadOffset: number;
  enemyTimer: number;
  shootTimer: number;
  gameOver: boolean;
};

const WIDTH = 420;
const HEIGHT = 640;

const ROAD_LEFT = 65;
const ROAD_RIGHT = 355;

const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 58;

const initialGame = (): GameState => ({
  playerX: WIDTH / 2,
  enemies: [],
  bullets: [],
  oils: [],
  score: 0,
  lives: 3,
  roadOffset: 0,
  enemyTimer: 0,
  shootTimer: 0,
  gameOver: false,
});

export default function SpyHunterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(initialGame());
  const keysRef = useRef(new Set<string>());

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const restart = () => {
    gameRef.current = initialGame();
    keysRef.current.clear();

    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationId = 0;
    let lastTime = 0;
    let hudTimer = 0;

    const game = gameRef.current;

    const keyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (
        ["arrowleft", "arrowright", "arrowup", "arrowdown", " "].includes(key)
      ) {
        event.preventDefault();
      }

      keysRef.current.add(key);

      if (key === "enter" && game.gameOver) {
        restart();
      }
    };

    const keyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const drawCar = (x: number, y: number, color: string, player = false) => {
      ctx.fillStyle = "#111";
      ctx.fillRect(x - 18, y - 27, 36, 54);

      // Wheels
      ctx.fillStyle = "#080808";
      ctx.fillRect(x - 21, y - 21, 6, 16);
      ctx.fillRect(x + 15, y - 21, 6, 16);
      ctx.fillRect(x - 21, y + 8, 6, 16);
      ctx.fillRect(x + 15, y + 8, 6, 16);

      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x - 15, y - 26, 30, 52);

      // Windshield
      ctx.fillStyle = player ? "#80d9ff" : "#a8c9d6";
      ctx.fillRect(x - 11, y - 13, 22, 15);

      ctx.fillRect(x - 11, y + 7, 22, 10);

      // Hood
      ctx.fillStyle = player ? "#ddd" : "#333";
      ctx.fillRect(x - 10, y - 23, 20, 5);

      // Lights
      ctx.fillStyle = "#fff6a0";
      ctx.fillRect(x - 12, y - 27, 7, 4);
      ctx.fillRect(x + 5, y - 27, 7, 4);

      if (player) {
        ctx.fillStyle = "#222";
        ctx.fillRect(x - 4, y - 30, 8, 10);
      }
    };

    const drawRoad = (offset: number) => {
      ctx.fillStyle = "#26733a";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Road
      ctx.fillStyle = "#444";
      ctx.fillRect(ROAD_LEFT, 0, ROAD_RIGHT - ROAD_LEFT, HEIGHT);

      // Road edges
      ctx.fillStyle = "#eee";
      ctx.fillRect(ROAD_LEFT, 0, 5, HEIGHT);
      ctx.fillRect(ROAD_RIGHT - 5, 0, 5, HEIGHT);

      // Center dashed line
      ctx.fillStyle = "#f5f5f5";

      for (let y = -50; y < HEIGHT; y += 90) {
        ctx.fillRect(WIDTH / 2 - 3, y + offset, 6, 42);
      }

      // Roadside trees
      for (let y = -40; y < HEIGHT; y += 110) {
        const treeY = (y + offset * 0.7) % HEIGHT;

        ctx.fillStyle = "#145225";
        ctx.beginPath();
        ctx.arc(30, treeY, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(390, treeY + 50, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = (delta: number) => {
      const g = gameRef.current;
      const keys = keysRef.current;

      if (g.gameOver) return;

      const speed = 260 * delta;

      if (keys.has("arrowleft") || keys.has("a")) {
        g.playerX -= speed;
      }

      if (keys.has("arrowright") || keys.has("d")) {
        g.playerX += speed;
      }

      g.playerX = Math.max(
        ROAD_LEFT + 25,
        Math.min(ROAD_RIGHT - 25, g.playerX),
      );

      // Scrolling road
      g.roadOffset += 220 * delta;

      if (g.roadOffset > 90) {
        g.roadOffset = 0;
      }

      // Shooting
      g.shootTimer -= delta;

      if (keys.has(" ") && g.shootTimer <= 0) {
        g.bullets.push({
          x: g.playerX,
          y: HEIGHT - 105,
        });

        g.shootTimer = 0.18;
      }

      // Oil slick
      if (keys.has("x") && g.oils.length < 3) {
        g.oils.push({
          x: g.playerX,
          y: HEIGHT - 65,
        });

        keys.delete("x");
      }

      // Spawn enemies
      g.enemyTimer -= delta;

      if (g.enemyTimer <= 0) {
        const lane = ROAD_LEFT + 45 + Math.random() * 200;

        g.enemies.push({
          x: lane,
          y: -50,
          speed: 100 + Math.random() * 100,
          color: ["#d13b32", "#e4c332", "#4385d1"][
            Math.floor(Math.random() * 3)
          ],
        });

        g.enemyTimer = Math.max(0.45, 1.3 - g.score / 3000);
      }

      // Move bullets
      g.bullets.forEach((bullet) => {
        bullet.y -= 450 * delta;
      });

      g.bullets = g.bullets.filter((bullet) => bullet.y > -20);

      // Move enemies
      g.enemies.forEach((enemy) => {
        enemy.y += enemy.speed * delta;

        // Enemy cars follow the player slightly
        enemy.x += Math.sign(g.playerX - enemy.x) * 20 * delta;
      });

      // Move oil slicks
      g.oils.forEach((oil) => {
        oil.y += 140 * delta;
      });

      g.oils = g.oils.filter((oil) => oil.y < HEIGHT + 50);

      // Bullet hits
      g.bullets.forEach((bullet) => {
        g.enemies.forEach((enemy) => {
          if (
            Math.abs(bullet.x - enemy.x) < 24 &&
            Math.abs(bullet.y - enemy.y) < 32
          ) {
            enemy.y = HEIGHT + 100;
            bullet.y = -100;
            g.score += 100;
          }
        });
      });

      // Oil hits
      g.oils.forEach((oil) => {
        g.enemies.forEach((enemy) => {
          if (
            Math.abs(oil.x - enemy.x) < 35 &&
            Math.abs(oil.y - enemy.y) < 40
          ) {
            enemy.y = HEIGHT + 100;
            g.score += 200;
          }
        });
      });

      // Player collision
      g.enemies.forEach((enemy) => {
        if (
          Math.abs(g.playerX - enemy.x) < 32 &&
          Math.abs(HEIGHT - 100 - enemy.y) < 48
        ) {
          enemy.y = HEIGHT + 100;
          g.lives -= 1;

          if (g.lives <= 0) {
            g.gameOver = true;
          }
        }
      });

      g.enemies = g.enemies.filter((enemy) => enemy.y < HEIGHT + 80);

      hudTimer += delta;

      if (hudTimer > 0.1) {
        setScore(g.score);
        setLives(g.lives);
        setGameOver(g.gameOver);
        hudTimer = 0;
      }
    };

    const draw = () => {
      const g = gameRef.current;

      drawRoad(g.roadOffset);

      // Oil slicks
      g.oils.forEach((oil) => {
        ctx.fillStyle = "#080808";
        ctx.beginPath();
        ctx.ellipse(oil.x, oil.y, 23, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bullets
      ctx.fillStyle = "#fff7a0";

      g.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x - 3, bullet.y - 10, 6, 18);
      });

      // Enemy cars
      g.enemies.forEach((enemy) => {
        drawCar(enemy.x, enemy.y, enemy.color);
      });

      // Player car
      if (!g.gameOver) {
        drawCar(g.playerX, HEIGHT - 100, "#ddd", true);
      }

      // Retro overlay
      ctx.fillStyle = "rgba(0,0,0,0.08)";

      for (let y = 0; y < HEIGHT; y += 4) {
        ctx.fillRect(0, y, WIDTH, 1);
      }
    };

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);

      lastTime = time;

      update(delta);
      draw();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  const hold = (key: string, pressed: boolean) => {
    if (pressed) {
      keysRef.current.add(key);
    } else {
      keysRef.current.delete(key);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl border-4 border-neutral-700 bg-neutral-950 p-4 text-green-400 shadow-2xl">
      <div className="mb-3 flex items-center justify-between font-bold">
        <div>
          <div className="text-xs tracking-widest text-red-500">SPY HUNTER</div>
          <div className="text-xl">
            SCORE: {score.toString().padStart(6, "0")}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-400">LIVES</div>
          <div className="text-xl">{"♥ ".repeat(Math.max(0, lives))}</div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded border-2 border-neutral-600">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block w-full"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center">
            <h2 className="text-4xl font-black text-red-500">GAME OVER</h2>

            <p className="mt-3 text-xl text-white">SCORE: {score}</p>

            <button
              onClick={restart}
              className="mt-6 rounded bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <button
          onPointerDown={() => hold("arrowleft", true)}
          onPointerUp={() => hold("arrowleft", false)}
          onPointerLeave={() => hold("arrowleft", false)}
          className="rounded bg-neutral-800 p-3 font-bold hover:bg-neutral-700"
        >
          ◀ LEFT
        </button>

        <button
          onPointerDown={() => hold(" ", true)}
          onPointerUp={() => hold(" ", false)}
          onPointerLeave={() => hold(" ", false)}
          className="rounded bg-red-700 p-3 font-bold text-white hover:bg-red-600"
        >
          FIRE
        </button>

        <button
          onPointerDown={() => hold("arrowright", true)}
          onPointerUp={() => hold("arrowright", false)}
          onPointerLeave={() => hold("arrowright", false)}
          className="rounded bg-neutral-800 p-3 font-bold hover:bg-neutral-700"
        >
          RIGHT ▶
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onPointerDown={() => hold("x", true)}
          className="rounded bg-yellow-700 p-2 font-bold text-white hover:bg-yellow-600"
        >
          OIL SLICK
        </button>

        <button
          onClick={restart}
          className="rounded bg-neutral-700 p-2 font-bold text-white hover:bg-neutral-600"
        >
          RESTART
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-neutral-500">
        ARROWS / A-D: DRIVE · SPACE: FIRE · X: OIL
      </p>
    </div>
  );
}
