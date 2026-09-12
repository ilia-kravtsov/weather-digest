import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchForecast } from './forecastClient.js';
import { fetchJson } from './httpClient.js';

vi.mock('../config.js', () => ({
  config: {
    forecastBaseUrl: 'https://forecast.test/v1',
  },
}));

vi.mock('./httpClient.js', () => ({
  fetchJson: vi.fn(),
}));

const fetchJsonMock = vi.mocked(fetchJson);

describe('fetchForecast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns formatted forecast data', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'Europe/Moscow',
      daily: {
        time: ['2026-09-11', '2026-09-12', '2026-09-13'],
        temperature_2m_max: [20.5, 21.2, 19.8],
        temperature_2m_min: [10.1, 11.3, 9.7],
        precipitation_sum: [0, 1.5, 3.2],
      },
    });

    const result = await fetchForecast(56.32867, 44.00205, 3);

    expect(result).toEqual({
      timezone: 'Europe/Moscow',
      days: [
        {
          date: '2026-09-11',
          temperatureMax: 20.5,
          temperatureMin: 10.1,
          precipitation: 0,
        },
        {
          date: '2026-09-12',
          temperatureMax: 21.2,
          temperatureMin: 11.3,
          precipitation: 1.5,
        },
        {
          date: '2026-09-13',
          temperatureMax: 19.8,
          temperatureMin: 9.7,
          precipitation: 3.2,
        },
      ],
    });
  });

  it('creates the correct forecast request URL', async () => {
    fetchJsonMock.mockResolvedValue({
      timezone: 'Europe/Moscow',
      daily: {
        time: ['2026-09-11'],
        temperature_2m_max: [20],
        temperature_2m_min: [10],
        precipitation_sum: [0],
      },
    });

    await fetchForecast(56.32867, 44.00205, 3);

    expect(fetchJsonMock).toHaveBeenCalledOnce();

    const requestedUrl = fetchJsonMock.mock.calls[0]![0];

    expect(requestedUrl).toBeInstanceOf(URL);
    expect(requestedUrl.origin).toBe('https://forecast.test');
    expect(requestedUrl.pathname).toBe('/v1/forecast');

    expect(requestedUrl.searchParams.get('latitude')).toBe('56.32867');

    expect(requestedUrl.searchParams.get('longitude')).toBe('44.00205');

    expect(requestedUrl.searchParams.get('forecast_days')).toBe('3');

    expect(requestedUrl.searchParams.get('timezone')).toBe('auto');

    expect(requestedUrl.searchParams.get('daily')).toBe(
      'temperature_2m_max,temperature_2m_min,precipitation_sum',
    );
  });
});
