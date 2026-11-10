import { useState } from "react";

export default function About() {
  const [input, setInput] = useState("Electron");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callGetReturnString = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const text = await window.electronAPI.getReturnString(input);
      setResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="mb-2 text-2xl font-semibold">About</h1>
      <p className="text-neutral-600">
        This app uses React Router with a hash-based history so routing works in
        both development and packaged Electron builds.
      </p>

      <div className="space-y-2 rounded-lg border border-neutral-200 p-4">
        <h2 className="font-semibold">GetReturnString</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded border border-neutral-300 px-3 py-2"
            aria-label="String to send to MusicDB"
          />
          <button
            type="button"
            onClick={callGetReturnString}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Calling…" : "Call API"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <p className="rounded bg-neutral-100 p-3 text-sm whitespace-pre-wrap">
            {result}
          </p>
        )}
      </div>
    </section>
  );
}
