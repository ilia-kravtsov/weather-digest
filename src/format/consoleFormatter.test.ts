import { describe, expect, it } from 'vitest';

import type { WeatherReport } from '../types/weatherReport.js';

import { formatWeatherReport } from './consoleFormatter.js';

describe('formatWeatherReport', () => {
  it('formats weather report for console output', () => {
    const report: WeatherReport = {
      requestedCity: 'Нижний Новгород',
      city: 'Нижний Новгород',
      country: 'Россия',
      latitude: 56.32867,
      longitude: 44.00205,
      timezone: 'Europe/Moscow',
      forecastDays: 2,
      temperatureUnit: 'celsius',
      precipitationUnit: 'mm',
      createdAt: '2026-09-11T12:00:00.000Z',
      days: [
        {
          date: '2026-09-11',
          temperatureMax: 18.4,
          temperatureMin: 11.1,
          precipitation: 7.3,
        },
        {
          date: '2026-09-12',
          temperatureMax: 16.1,
          temperatureMin: 8.6,
          precipitation: 0,
        },
      ],
    };

    const result = formatWeatherReport(report);

    expect(result).toContain('Погода: Нижний Новгород, Россия');

    expect(result).toContain('Координаты: 56.32867, 44.00205');

    expect(result).toContain('Часовой пояс: Europe/Moscow');

    expect(result).toContain('Дата');
    expect(result).toContain('Мин., °C');
    expect(result).toContain('Макс., °C');
    expect(result).toContain('Осадки, мм');

    expect(result).toContain('2026-09-11');
    expect(result).toContain('11.1');
    expect(result).toContain('18.4');
    expect(result).toContain('7.3');

    expect(result).toContain('2026-09-12');
    expect(result).toContain('8.6');
    expect(result).toContain('16.1');
  });
});
