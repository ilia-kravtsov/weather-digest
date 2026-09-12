import type {
  ForecastResult,
} from '../api/forecastClient.js';

import type {
  GeocodingResult,
} from '../api/geocodingClient.js';

import type {
  WeatherReport,
} from '../types/weatherReport.js';

import { config } from '../config.js';

export function createWeatherReport(
  requestedCity: string,
  forecastDays: number,
  location: GeocodingResult,
  forecast: ForecastResult,
): WeatherReport {
  return {
    requestedCity,

    city: location.name,
    country: location.country,

    latitude: location.latitude,
    longitude: location.longitude,

    timezone: forecast.timezone,

    forecastDays,

    temperatureUnit: config.temperatureUnit,
    precipitationUnit: config.precipitationUnit,

    createdAt: new Date().toISOString(),

    days: forecast.days,
  };
}