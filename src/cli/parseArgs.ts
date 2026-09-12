export interface CliOptions {
  cities: string[];
  days: number;
  noCache: boolean;
}

export function parseArgs(args: string[]): CliOptions {
  const allowedArguments = new Set([
    '--city',
    '--days',
    '--no-cache',
  ]);

  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument) {
      if (!argument.startsWith('--')) {
        continue;
      }

      if (!allowedArguments.has(argument)) {
        throw new Error(
          `Неизвестный аргумент: ${argument}`,
        );
      }
    }
  }

  const cityIndex = args.indexOf('--city');
  const daysIndex = args.indexOf('--days');

  if (cityIndex === -1) {
    throw new Error('Необходимо указать --city');
  }

  const cityValue = args[cityIndex + 1];

  if (!cityValue || cityValue.startsWith('--')) {
    throw new Error('Необходимо указать город после --city');
  }

  const cities = cityValue
    .split(',')
    .map((city) => city.trim())
    .filter((city) => city.length > 0);

  if (cities.length === 0) {
    throw new Error('Необходимо указать хотя бы один город');
  }

  let days = 3;

  if (daysIndex !== -1) {
    const daysValue = args[daysIndex + 1];

    if (!daysValue || daysValue.startsWith('--')) {
      throw new Error('Необходимо указать количество дней после --days');
    }

    days = Number(daysValue);

    if (!Number.isInteger(days) || days < 1 || days > 7) {
      throw new Error('--days должен быть целым числом от 1 до 7');
    }
  }

  const noCache = args.includes('--no-cache');

  return {
    cities,
    days,
    noCache,
  };
}