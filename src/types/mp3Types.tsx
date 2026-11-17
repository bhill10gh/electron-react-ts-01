export interface Mp3InfoDto {
  mp3Info_Id: number;
  fileInfo_Id: number;
  song_Title: string;
  album?: string | null;
  genre?: string | null;
  comments?: string | null;
  track?: number | null;
  song_Numeraton?: string | null;
}

export interface Mp3SongWithArtists {
  mp3Info: Mp3InfoDto;
  artistNames: string;
}

export interface SongSearchRow {
  title: string;
  album: string;
  genre: string;
  artists: string;
  track: string;
}

export function toSongSearchRows(
  songs: Mp3SongWithArtists[],
): SongSearchRow[] {
  return songs.map((song) => ({
    title: song.mp3Info.song_Title,
    album: song.mp3Info.album ?? "",
    genre: song.mp3Info.genre ?? "",
    artists: song.artistNames,
    track: song.mp3Info.track != null ? String(song.mp3Info.track) : "",
  }));
}
