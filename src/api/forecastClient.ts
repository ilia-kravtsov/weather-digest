import { config } from '../config.js';

import { fetchJson } from './httpClient.js';

export interface ForecastDay {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
}

export interface ForecastResult {
  timezone: string;
  days: ForecastDay[];
}

interface ForecastApiResponse {
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  days: number,
): Promise<ForecastResult> {
  const url = new URL(
    `${config.forecastBaseUrl}/forecast`,
  );

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily:
      'temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: String(days),
    timezone: 'auto',
    temperature_unit: config.temperatureUnit,
    precipitation_unit: config.precipitationUnit,
  }).toString();

  const data = await fetchJson<ForecastApiResponse>(url);

  const forecastDays = data.daily.time.map((date, index) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[index]!,
    temperatureMin: data.daily.temperature_2m_min[index]!,
    precipitation: data.daily.precipitation_sum[index]!,
  }));

  return {
    timezone: data.timezone,
    days: forecastDays,
  };
}