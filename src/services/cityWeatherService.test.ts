import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { fetchForecast } from '../api/forecastClient.js';
import { geocodeCity } from '../api/geocodingClient.js';

import {
  readCachedReport,
  saveReport,
} from '../storage/reportStorage.js';

import {
  createWeatherReport,
} from './weatherReportService.js';

import { processCity } from './cityWeatherService.js';

import type {
  WeatherReport,
} from '../types/weatherReport.js';

vi.mock('../api/geocodingClient.js', () => ({
  geocodeCity: vi.fn(),
}));

vi.mock('../api/forecastClient.js', () => ({
  fetchForecast: vi.fn(),
}));

vi.mock('../storage/reportStorage.js', () => ({
  readCachedReport: vi.fn(),
  saveReport: vi.fn(),
}));

vi.mock('./weatherReportService.js', () => ({
  createWeatherReport: vi.fn(),
}));

const geocodeCityMock = vi.mocked(geocodeCity);
const fetchForecastMock = vi.mocked(fetchForecast);
const readCachedReportMock = vi.mocked(readCachedReport);
const saveReportMock = vi.mocked(saveReport);
const createWeatherReportMock =
  vi.mocked(createWeatherReport);

const report: WeatherReport = {
  requestedCity: 'Москва',
  city: 'Москва',
  country: 'Россия',
  latitude: 55.75204,
  longitude: 37.61781,
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

describe('processCity', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached report without calling API', async () => {
    readCachedReportMock.mockResolvedValue(report);

    const result = await processCity('Москва', {
      days: 3,
      noCache: false,
    });

    expect(result).toEqual({
      report,
      fromCache: true,
    });

    expect(readCachedReportMock).toHaveBeenCalledWith(
      'Москва',
      3,
    );

    expect(geocodeCityMock).not.toHaveBeenCalled();
    expect(fetchForecastMock).not.toHaveBeenCalled();
    expect(saveReportMock).not.toHaveBeenCalled();
  });

  it('fetches weather and saves report when cache is missing', async () => {
    readCachedReportMock.mockResolvedValue(null);

    geocodeCityMock.mockResolvedValue({
      name: 'Москва',
      country: 'Россия',
      latitude: 55.75204,
      longitude: 37.61781,
    });

    fetchForecastMock.mockResolvedValue({
      timezone: 'Europe/Moscow',
      days: report.days,
    });

    createWeatherReportMock.mockReturnValue(report);

    saveReportMock.mockResolvedValue(
      'reports/Москва-2026-09-11.json',
    );

    const result = await processCity('Москва', {
      days: 3,
      noCache: false,
    });

    expect(result).toEqual({
      report,
      fromCache: false,
      reportPath: 'reports/Москва-2026-09-11.json',
    });

    expect(readCachedReportMock).toHaveBeenCalledWith(
      'Москва',
      3,
    );

    expect(geocodeCityMock).toHaveBeenCalledWith('Москва');

    expect(fetchForecastMock).toHaveBeenCalledWith(
      55.75204,
      37.61781,
      3,
    );

    expect(createWeatherReportMock).toHaveBeenCalled();
    expect(saveReportMock).toHaveBeenCalledWith(report);
  });

  it('skips cache completely when noCache is true', async () => {
    geocodeCityMock.mockResolvedValue({
      name: 'Москва',
      country: 'Россия',
      latitude: 55.75204,
      longitude: 37.61781,
    });

    fetchForecastMock.mockResolvedValue({
      timezone: 'Europe/Moscow',
      days: report.days,
    });

    createWeatherReportMock.mockReturnValue(report);

    saveReportMock.mockResolvedValue(
      'reports/Москва-2026-09-11.json',
    );

    const result = await processCity('Москва', {
      days: 3,
      noCache: true,
    });

    expect(readCachedReportMock).not.toHaveBeenCalled();

    expect(geocodeCityMock).toHaveBeenCalledWith('Москва');

    expect(result.fromCache).toBe(false);
  });

  it('propagates city processing errors', async () => {
    readCachedReportMock.mockResolvedValue(null);

    geocodeCityMock.mockRejectedValue(
      new Error('Город "Неизвестный" не найден'),
    );

    await expect(
      processCity('Неизвестный', {
        days: 3,
        noCache: false,
      }),
    ).rejects.toThrow(
      'Город "Неизвестный" не найден',
    );

    expect(fetchForecastMock).not.toHaveBeenCalled();
    expect(saveReportMock).not.toHaveBeenCalled();
  });
});