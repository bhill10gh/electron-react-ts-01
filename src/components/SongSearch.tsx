import { useState } from "react";
import DynamicGrid from "./DynamicGrid";
import {
  toSongSearchRows,
  type Mp3SongWithArtists,
} from "../types/mp3Types";

const columns = ["Title", "Album", "Genre", "Artists", "Track"];

interface SongSearchProps {
  title?: string;
}

export default function SongSearch({ title = "" }: SongSearchProps) {
  const [artistName, setArtistName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rows, setRows] = useState<ReturnType<typeof toSongSearchRows>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const hasAnyFilter = () =>
    [artistName, songTitle, genre].some((value) => value.trim().length > 0);

  const runSearch = async () => {
    if (!hasAnyFilter()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data: Mp3SongWithArtists[] = await window.electronAPI.searchSongs({
        artistName: artistName.trim() || undefined,
        songTitle: songTitle.trim() || undefined,
        genre: genre.trim() || undefined,
      });
      setRows(toSongSearchRows(data));
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <label htmlFor="artist-name" className="w-28 shrink-0">
            Artist name
          </label>
          <input
            type="search"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            placeholder="Artist name"
            className="flex-1 rounded border border-neutral-300 px-3 py-2"
            aria-label="Artist name to search"
            id="artist-name"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="song-title" className="w-28 shrink-0">
            Song title
          </label>
          <input
            type="search"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            placeholder="Song title"
            className="flex-1 rounded border border-neutral-300 px-3 py-2"
            aria-label="Song title to search"
            id="song-title"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="genre" className="w-28 shrink-0">
            Genre
          </label>
          <input
            type="search"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void runSearch()}
            placeholder="Genre"
            className="flex-1 rounded border border-neutral-300 px-3 py-2"
            aria-label="Genre to search"
            id="genre"
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={loading || !hasAnyFilter()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {searched && !loading && !error && rows.length === 0 && (
        <p className="text-gray-500">No songs matched your search.</p>
      )}

      {rows.length > 0 && <DynamicGrid columns={columns} data={rows} />}
    </section>
  );
}