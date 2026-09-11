import type { ForecastDay } from '../api/forecastClient.js';

export interface WeatherReport {
  requestedCity: string;

  city: string;
  country: string;

  latitude: number;
  longitude: number;

  timezone: string;

  forecastDays: number;
  createdAt: string;

  days: ForecastDay[];
}