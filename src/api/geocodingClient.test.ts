import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { geocodeCity } from './geocodingClient.js';
import { fetchJson } from './httpClient.js';

vi.mock('../config.js', () => ({
  config: {
    geocodingBaseUrl: 'https://geocoding.test/v1',
  },
}));

vi.mock('./httpClient.js', () => ({
  fetchJson: vi.fn(),
}));

const fetchJsonMock = vi.mocked(fetchJson);

describe('geocodeCity', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns location data for an existing city', async () => {
    fetchJsonMock.mockResolvedValue({
      results: [
        {
          name: 'Нижний Новгород',
          country: 'Россия',
          latitude: 56.32867,
          longitude: 44.00205,
        },
      ],
    });

    const result = await geocodeCity('Нижний Новгород');

    expect(result).toEqual({
      name: 'Нижний Новгород',
      country: 'Россия',
      latitude: 56.32867,
      longitude: 44.00205,
    });
  });

  it('creates the correct geocoding request URL', async () => {
    fetchJsonMock.mockResolvedValue({
      results: [
        {
          name: 'Москва',
          country: 'Россия',
          latitude: 55.75222,
          longitude: 37.61556,
        },
      ],
    });

    await geocodeCity('Москва');

    expect(fetchJsonMock).toHaveBeenCalledOnce();

    const requestedUrl =
      fetchJsonMock.mock.calls[0]![0];

    expect(requestedUrl).toBeInstanceOf(URL);
    expect(requestedUrl.origin).toBe(
      'https://geocoding.test',
    );
    expect(requestedUrl.pathname).toBe('/v1/search');

    expect(requestedUrl.searchParams.get('name')).toBe(
      'Москва',
    );
    expect(requestedUrl.searchParams.get('count')).toBe('1');
    expect(requestedUrl.searchParams.get('language')).toBe(
      'ru',
    );
    expect(requestedUrl.searchParams.get('format')).toBe(
      'json',
    );
  });

  it('throws an error when city is not found', async () => {
    fetchJsonMock.mockResolvedValue({});

    await expect(
      geocodeCity('НесуществующийГород'),
    ).rejects.toThrow(
      'Город "НесуществующийГород" не найден',
    );
  });
});