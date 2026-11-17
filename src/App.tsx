import { HashRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Weather from "./pages/Weather";
import EmployeeAssignment from "./pages/EmployeeAssignment";
import Home from "./pages/Home";
import { MenuWithScrollingContent } from "./components/DropdownMenuWithScroll";
import SongSearch from "./pages/SongSearch";
import FileReaderComponent from "./components/FileReaderComponent";
import { AudioPlayer } from "./components/AudioPlayer";
import { VideoPlayer } from "./components/VideoPlayer";
import { TailwindButtons } from "./pages/TailwindButtons";

export default function App() {
  return (
    <HashRouter>
      <div className="ml-4 mr-4 font-sans">
        <MenuWithScrollingContent />
        <div id="page-content" className="mt-4 m-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/weather" element={<Weather />} />
            <Route
              path="/employee-assignment"
              element={<EmployeeAssignment />}
            />
            <Route path="/find-song" element={<SongSearch />} />
            <Route path="/file-reader" element={<FileReaderComponent />} />
            <Route path="/audio-player" element={<AudioPlayer />} />
            <Route path="/video-player" element={<VideoPlayer />} />
            <Route path="/tailwind-buttons" element={<TailwindButtons />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
