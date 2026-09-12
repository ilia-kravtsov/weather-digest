import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';

import os from 'node:os';
import path from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import type {
  WeatherReport,
} from '../types/weatherReport.js';

import {
  getReportPath,
  readCachedReport,
  saveReport,
} from './reportStorage.js';

let tempDir: string;

const date = new Date(2026, 8, 11);

const report: WeatherReport = {
  requestedCity: 'Нижний Новгород',

  city: 'Нижний Новгород',
  country: 'Россия',

  latitude: 56.32867,
  longitude: 44.00205,

  timezone: 'Europe/Moscow',

  forecastDays: 3,
  temperatureUnit: 'celsius',
  precipitationUnit: 'mm',

  createdAt: '2026-09-11T12:00:00.000Z',

  days: [
    {
      date: '2026-09-11',
      temperatureMax: 20,
      temperatureMin: 10,
      precipitation: 0,
    },
  ],
};

beforeEach(async () => {
  tempDir = await mkdtemp(
    path.join(os.tmpdir(), 'weather-digest-'),
  );
});

afterEach(async () => {
  await rm(tempDir, {
    recursive: true,
    force: true,
  });
});

describe('reportStorage', () => {
  it('creates report path using city and date', () => {
    const reportPath = getReportPath(
      'Нижний Новгород',
      tempDir,
      date,
    );

    expect(path.basename(reportPath)).toBe(
      'Нижний Новгород-2026-09-11.json',
    );
  });

  it('saves report as JSON', async () => {
    const reportPath = await saveReport(
      report,
      tempDir,
      date,
    );

    const content = await readFile(
      reportPath,
      'utf8',
    );

    expect(JSON.parse(content)).toEqual(report);
  });

  it('reads valid cached report', async () => {
    await saveReport(
      report,
      tempDir,
      date,
    );

    const cachedReport = await readCachedReport(
      'Нижний Новгород',
      3,
      tempDir,
      date,
    );

    expect(cachedReport).toEqual(report);
  });

  it('returns null when cache does not exist', async () => {
    const cachedReport = await readCachedReport(
      'Москва',
      3,
      tempDir,
      date,
    );

    expect(cachedReport).toBeNull();
  });

  it('returns null when forecast days do not match', async () => {
    await saveReport(
      report,
      tempDir,
      date,
    );

    const cachedReport = await readCachedReport(
      'Нижний Новгород',
      7,
      tempDir,
      date,
    );

    expect(cachedReport).toBeNull();
  });

  it('returns null for invalid JSON', async () => {
    const reportPath = getReportPath(
      'Нижний Новгород',
      tempDir,
      date,
    );

    await writeFile(
      reportPath,
      'invalid json',
      'utf8',
    );

    const cachedReport = await readCachedReport(
      'Нижний Новгород',
      3,
      tempDir,
      date,
    );

    expect(cachedReport).toBeNull();
  });
});