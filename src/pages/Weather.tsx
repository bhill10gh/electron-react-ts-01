import { useEffect, useState } from "react";
import type { WeatherForecast } from "../types/electron";
import DynamicGrid, { type GridColumn } from "../components/DynamicGrid.tsx";

export default function Weather() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await window.electronAPI.getWeather();
        setForecasts(data);
      } catch (error) {
        console.error("Error loading weather:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) return <p>Loading weather...</p>;

  if (forecasts.length === 0) {
    return <p>No weather forecasts available.</p>;
  }

  const columns: GridColumn<WeatherForecast>[] = (
    Object.keys(forecasts[0]) as (keyof WeatherForecast)[]
  ).map((key) => ({
    key,
    header: key,
  }));

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Weather Forecast</h1>
      <DynamicGrid data={forecasts} columns={columns} />
    </>
  );
}
