import { HashRouter, Link, Route, Routes } from "react-router-dom";
import Hello from "./components/Hello";
import About from "./pages/About";
import Weather from "./pages/Weather";
import EmployeeAssignment from "./pages/EmployeeAssignment";
import Home from "./pages/Home";

export default function App() {
  return (
    <HashRouter>
      <div className="mx-auto max-w-xl p-8 font-sans">
        <header className="mb-6 flex items-center justify-between gap-4">
          <nav className="flex gap-4 text-sm">
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/employee-assignment" element={<EmployeeAssignment />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
