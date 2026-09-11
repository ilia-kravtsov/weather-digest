import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import path from 'node:path';

import { config } from '../config.js';

import type {
  WeatherReport,
} from '../types/weatherReport.js';

function formatDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0',);

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sanitizeCityForFilename(city: string): string {
  return city
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/[. ]+$/g, '');
}

export function getReportPath(
  city: string,
  reportsDir = config.reportsDir,
  date = new Date(),
): string {
  const safeCity = sanitizeCityForFilename(city);

  const filename = `${safeCity}-${formatDate(date)}.json`;

  return path.join(reportsDir, filename);
}

export async function saveReport(
  report: WeatherReport,
  reportsDir = config.reportsDir,
  date = new Date(),
): Promise<string> {
  await mkdir(reportsDir, {
    recursive: true,
  });

  const reportPath = getReportPath(
    report.requestedCity,
    reportsDir,
    date,
  );

  await writeFile(
    reportPath,
    JSON.stringify(report, null, 2),
    'utf8',
  );

  return reportPath;
}

export async function readCachedReport(
  city: string,
  forecastDays: number,
  reportsDir = config.reportsDir,
  date = new Date(),
): Promise<WeatherReport | null> {
  const reportPath = getReportPath(
    city,
    reportsDir,
    date,
  );

  let content: string;

  try {
    content = await readFile(reportPath, 'utf8');
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return null;
    }

    throw error;
  }

  let report: unknown;

  try {
    report = JSON.parse(content);
  } catch {
    return null;
  }

  if (!isWeatherReport(report)) {
    return null;
  }

  if (report.forecastDays !== forecastDays) {
    return null;
  }

  if (
    report.requestedCity.toLowerCase() !==
    city.toLowerCase()
  ) {
    return null;
  }

  return report;
}

function isWeatherReport(
  value: unknown,
): value is WeatherReport {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const report = value as Partial<WeatherReport>;

  return (
    typeof report.requestedCity === 'string' &&
    typeof report.city === 'string' &&
    typeof report.country === 'string' &&
    typeof report.latitude === 'number' &&
    typeof report.longitude === 'number' &&
    typeof report.timezone === 'string' &&
    typeof report.forecastDays === 'number' &&
    typeof report.createdAt === 'string' &&
    Array.isArray(report.days)
  );
}