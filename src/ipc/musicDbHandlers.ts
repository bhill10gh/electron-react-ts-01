import { ipcMain } from "electron";

export type SearchSongsFilters = {
  songTitle?: string;
  artistName?: string;
  genre?: string;
};

function installHandler(
  channel: string,
  handler: Parameters<typeof ipcMain.handle>[1],
): void {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, handler);
}

/** Registers MusicDB IPC channels (safe to call again after main-process hot reload). */
export function registerMusicDbHandlers(apiUrl: string): void {
  installHandler("musicdb:getReturnString", async (_event, str: string) => {
    const response = await fetch(
      `${apiUrl}/MusicDB?str=${encodeURIComponent(str)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to call GetReturnString");
    }

    return await response.text();
  });

  installHandler("musicdb:findSong", async (_event, search: string) => {
    const response = await fetch(
      `${apiUrl}/MusicDB/find-song/${encodeURIComponent(search)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to find songs");
    }

    return await response.json();
  });

  installHandler("musicdb:findArtistSongs", async (_event, search: string) => {
    const response = await fetch(
      `${apiUrl}/MusicDB/find-artist-songs/${encodeURIComponent(search)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to find artist songs");
    }

    return await response.json();
  });

  installHandler(
    "musicdb:searchSongs",
    async (_event, filters: SearchSongsFilters) => {
      const params = new URLSearchParams();
      const songTitle = filters.songTitle?.trim();
      const artistName = filters.artistName?.trim();
      const genre = filters.genre?.trim();

      if (songTitle) {
        params.set("songTitle", songTitle);
      }
      if (artistName) {
        params.set("artistName", artistName);
      }
      if (genre) {
        params.set("genre", genre);
      }

      const query = params.toString();
      const url = query
        ? `${apiUrl}/MusicDB/search-songs?${query}`
        : `${apiUrl}/MusicDB/search-songs`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to search songs");
      }

      return await response.json();
    },
  );
}