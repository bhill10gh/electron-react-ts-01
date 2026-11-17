import { useState } from "react";
import DynamicGrid from "../components/DynamicGrid";
import { toSongSearchRows, type Mp3SongWithArtists } from "../types/mp3Types";

const columns = ["Title", "Album", "Genre", "Artists", "Track"];

interface FindSongProps {
  title?: string;
}
export default function FindSong({ title }: FindSongProps) {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ReturnType<typeof toSongSearchRows>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async () => {
    const term = search.trim();
    if (!term) {
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data: Mp3SongWithArtists[] =
        await window.electronAPI.findSong(term);
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
      <h1 className="text-2xl font-semibold">{title ?? ""}</h1>

      <div className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void runSearch()}
          placeholder="Song title"
          className="flex-1 rounded border border-neutral-300 px-3 py-2"
          aria-label="Song title to search"
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={loading || !search.trim()}
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
