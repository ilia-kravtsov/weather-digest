import { config } from '../config.js';
import { fetchJson } from './httpClient.js';

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GeocodingApiResponse {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

export async function geocodeCity(
  city: string,
): Promise<GeocodingResult> {
  const url = new URL(
    `${config.geocodingBaseUrl}/search`,
  );

  url.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'ru',
    format: 'json',
  }).toString();

  const data = await fetchJson<GeocodingApiResponse>(url);

  const location = data.results?.[0];

  if (!location) {
    throw new Error(`Город "${city}" не найден`);
  }

  return {
    name: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}