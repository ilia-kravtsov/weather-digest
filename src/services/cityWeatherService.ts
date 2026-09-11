import { fetchForecast } from '../api/forecastClient.js';
import { geocodeCity } from '../api/geocodingClient.js';

import {
  createWeatherReport,
} from './weatherReportService.js';

import {
  readCachedReport,
  saveReport,
} from '../storage/reportStorage.js';

import type {
  WeatherReport,
} from '../types/weatherReport.js';

export interface ProcessCityOptions {
  days: number;
  noCache: boolean;
}

export interface ProcessCityResult {
  report: WeatherReport;
  fromCache: boolean;
  reportPath?: string;
}

export async function processCity(
  city: string,
  options: ProcessCityOptions,
): Promise<ProcessCityResult> {
  if (!options.noCache) {
    const cachedReport = await readCachedReport(
      city,
      options.days,
    );

    if (cachedReport) {
      return {
        report: cachedReport,
        fromCache: true,
      };
    }
  }

  const location = await geocodeCity(city);

  const forecast = await fetchForecast(
    location.latitude,
    location.longitude,
    options.days,
  );

  const report = createWeatherReport(
    city,
    options.days,
    location,
    forecast,
  );

  const reportPath = await saveReport(report);

  return {
    report,
    fromCache: false,
    reportPath,
  };
}