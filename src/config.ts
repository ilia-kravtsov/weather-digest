import 'dotenv/config';

const DEFAULT_GEOCODING_BASE_URL =
  'https://geocoding-api.open-meteo.com/v1';

const DEFAULT_FORECAST_BASE_URL =
  'https://api.open-meteo.com/v1';

const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

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
    throw new Error(
      `${variableName} должен быть положительным целым числом`,
    );
  }

  return parsedValue;
}

export const config = {
  geocodingBaseUrl:
    process.env.GEOCODING_BASE_URL ??
    DEFAULT_GEOCODING_BASE_URL,

  forecastBaseUrl:
    process.env.FORECAST_BASE_URL ??
    DEFAULT_FORECAST_BASE_URL,

  requestTimeoutMs: parsePositiveInteger(
    process.env.REQUEST_TIMEOUT_MS,
    DEFAULT_REQUEST_TIMEOUT_MS,
    'REQUEST_TIMEOUT_MS',
  ),

  reportsDir: process.env.REPORTS_DIR ?? 'reports',
};