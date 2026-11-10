export {};

declare global {
  interface Window {
    electronAPI: {
      closeWindow: () => void;
      getWeather: () => Promise<WeatherForecast[]>;
      getReturnString: (str: string) => Promise<string>;
    };
  }
}

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
