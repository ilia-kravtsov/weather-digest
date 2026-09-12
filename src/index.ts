import { parseArgs } from './cli/parseArgs.js';

import { processCity } from './services/cityWeatherService.js';

import { formatWeatherReport } from './format/consoleFormatter.js';

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    const results = await Promise.allSettled(
      options.cities.map((city) =>
        processCity(city, {
          days: options.days,
          noCache: options.noCache,
        }),
      ),
    );

    let hasErrors = false;

    results.forEach((result, index) => {
      const city = options.cities[index];

      if (result.status === 'fulfilled') {
        const { report, fromCache, reportPath } = result.value;

        console.log('');

        if (fromCache) {
          console.log('Использован кешированный отчёт');
        }

        console.log(formatWeatherReport(report));

        if (reportPath) {
          console.log(`Отчёт сохранён: ${reportPath}`);
        }

        return;
      }

      hasErrors = true;

      if (result.reason instanceof Error) {
        console.error(
          `\nОшибка для города "${city}": ${result.reason.message}`,
        );
      } else {
        console.error(`\nОшибка для города "${city}": неизвестная ошибка`);
      }
    });

    if (hasErrors) {
      process.exitCode = 1;
    }
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
