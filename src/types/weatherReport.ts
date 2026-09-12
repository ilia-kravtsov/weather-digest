import type { ForecastDay } from '../api/forecastClient.js';
import type {
  PrecipitationUnit,
  TemperatureUnit,
} from '../config.js';

export interface WeatherReport {
  requestedCity: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  forecastDays: number;
  temperatureUnit: TemperatureUnit;
  precipitationUnit: PrecipitationUnit;
  createdAt: string;
  days: ForecastDay[];
}