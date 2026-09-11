import { fetchForecast } from './api/forecastClient.js';
import { geocodeCity } from './api/geocodingClient.js';
import { parseArgs } from './cli/parseArgs.js';

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    const city = options.cities[0];

    if (!city) {
      throw new Error('Город не указан');
    }

    const location = await geocodeCity(city);

    const forecast = await fetchForecast(
      location.latitude,
      location.longitude,
      options.days,
    );

    console.log({
      location,
      forecast,
    });
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