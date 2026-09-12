import 'dotenv/config';

const DEFAULT_GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

const DEFAULT_FORECAST_BASE_URL = 'https://api.open-meteo.com/v1';

const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type PrecipitationUnit = 'mm' | 'inch';

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  variableName: string,
): number {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${variableName} должен быть положительным целым числом`);
  }

  return parsedValue;
}

function parseTemperatureUnit(value: string | undefined): TemperatureUnit {
  if (value === undefined) {
    return 'celsius';
  }

  if (value === 'celsius' || value === 'fahrenheit') {
    return value;
  }

  throw new Error('TEMPERATURE_UNIT должен быть "celsius" или "fahrenheit"');
}

function parsePrecipitationUnit(value: string | undefined): PrecipitationUnit {
  if (value === undefined) {
    return 'mm';
  }

  if (value === 'mm' || value === 'inch') {
    return value;
  }

  throw new Error('PRECIPITATION_UNIT должен быть "mm" или "inch"');
}

export const config = {
  get geocodingBaseUrl(): string {
    return process.env.GEOCODING_BASE_URL ?? DEFAULT_GEOCODING_BASE_URL;
  },

  get forecastBaseUrl(): string {
    return process.env.FORECAST_BASE_URL ?? DEFAULT_FORECAST_BASE_URL;
  },

  get requestTimeoutMs(): number {
    return parsePositiveInteger(
      process.env.REQUEST_TIMEOUT_MS,
      DEFAULT_REQUEST_TIMEOUT_MS,
      'REQUEST_TIMEOUT_MS',
    );
  },

  get reportsDir(): string {
    return process.env.REPORTS_DIR ?? 'reports';
  },

  get temperatureUnit(): TemperatureUnit {
    return parseTemperatureUnit(process.env.TEMPERATURE_UNIT);
  },

  get precipitationUnit(): PrecipitationUnit {
    return parsePrecipitationUnit(process.env.PRECIPITATION_UNIT);
  },
};
