export {};

export interface FileResult {
  filePath: string;
  content: string;
}

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<FileResult | null>;
      openAudioFile: () => Promise<string | null>;
      openVideo: () => Promise<string | null>;
      closeWindow: () => void;
      getWeather: () => Promise<WeatherForecast[]>;
      getReturnString: (str: string) => Promise<string>;
      findSong: (
        search: string,
      ) => Promise<import("./mp3Types").Mp3SongWithArtists[]>;
      findArtistSongs: (
        search: string,
      ) => Promise<import("./mp3Types").Mp3SongWithArtists[]>;
    };
  }
}

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export type { Mp3SongWithArtists } from "./mp3Types";
