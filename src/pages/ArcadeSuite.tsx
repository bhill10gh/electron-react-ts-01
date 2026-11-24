import { useState } from "react";
import "../arcade/arcade.css";
import Snake from "../games/Snake";
import Tetris from "../games/Tetris";
import SpaceInvaders from "../games/SpaceInvaders";
import Minesweeper from "../games/Minesweeper";
import PacMaze from "../games/PacMaze";
import TicTacToe from "../games/TicTacToe";

const games = [
  { id: "snake", name: "Snake", description: "Eat, grow, and avoid your tail.", component: Snake },
  { id: "tetris", name: "Tetris", description: "Fit falling blocks into complete rows.", component: Tetris },
  { id: "space", name: "Space Invaders", description: "Defend the planet from an alien wave.", component: SpaceInvaders },
  { id: "mines", name: "Minesweeper", description: "Reveal safe squares and flag every mine.", component: Minesweeper },
  { id: "pac", name: "Maze Chomp", description: "Collect dots while avoiding roaming ghosts.", component: PacMaze },
  { id: "tic", name: "Tic-Tac-Toe", description: "Challenge a friend or the computer.", component: TicTacToe },
] as const;

export default function ArcadeSuite() {
  const [selected, setSelected] = useState<(typeof games)[number]["id"]>("snake");
  const active = games.find((game) => game.id === selected)!;
  const Game = active.component;

  return (
    <div className="arcade-suite px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[.3em] text-cyan-300">React + TypeScript Arcade</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            ARCADE <span className="text-cyan-300">SUITE</span>
          </h1>
          <p className="mt-3 text-slate-300">Six classic games. One React application.</p>
        </header>

        <nav className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Choose a game">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelected(game.id)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                selected === game.id
                  ? "border-cyan-300 bg-cyan-300/15 text-white"
                  : "border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-300/60"
              }`}
            >
              <span className="block font-bold">{game.name}</span>
              <span className="mt-1 block text-xs text-slate-400">{game.description}</span>
            </button>
          ))}
        </nav>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold">{active.name}</h2>
              <p className="text-sm text-slate-400">{active.description}</p>
            </div>
            <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-semibold text-cyan-200">
              PLAY NOW
            </span>
          </div>
          <Game key={selected} />
        </section>
        <footer className="mt-6 text-center text-xs text-slate-500">
          Built with React, TypeScript, Vite, and Tailwind CSS.
        </footer>
      </div>
    </div>
  );
}