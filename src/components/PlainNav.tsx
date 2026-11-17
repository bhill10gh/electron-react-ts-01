import { Link } from "react-router-dom";

export default function PlainNav() {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <nav className="flex flex-wrap gap-4 text-sm">
        <Link className="text-blue-600 hover:underline" to="/">
          Home
        </Link>
        <Link className="text-blue-600 hover:underline" to="/about">
          About
        </Link>
        <Link className="text-blue-600 hover:underline" to="/weather">
          Weather
        </Link>
        <Link
          className="text-blue-600 hover:underline"
          to="/employee-assignment"
        >
          Employee Assignment
        </Link>
        <Link className="text-blue-600 hover:underline" to="/find-song">
          Find Song
        </Link>
        <Link className="text-blue-600 hover:underline" to="/find-artist-songs">
          Find Artist Songs
        </Link>
      </nav>
      <button
        type="button"
        className="rounded-md p-2 hover:bg-red-500 hover:text-white"
        onClick={() => window.electronAPI.closeWindow()}
        aria-label="Close window"
      >
        ✕
      </button>
    </header>
  );
}