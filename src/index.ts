import { fetchForecast } from './api/forecastClient.js';
import { geocodeCity } from './api/geocodingClient.js';
import { parseArgs } from './cli/parseArgs.js';

import {
  createWeatherReport,
} from './services/weatherReportService.js';

import {
  readCachedReport,
  saveReport,
} from './storage/reportStorage.js';

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    const city = options.cities[0];

    if (!city) {
      throw new Error('Город не указан');
    }

    if (!options.noCache) {
      const cachedReport = await readCachedReport(
        city,
        options.days,
      );

      if (cachedReport) {
        console.log('Использован кешированный отчёт');
        console.log(cachedReport);

        return;
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

    console.log(report);
    console.log(`Отчёт сохранён: ${reportPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Ошибка: ${error.message}`);
    } else {
      console.error('Произошла неизвестная ошибка');
    }

    process.exitCode = 1;
  }
}

void main();