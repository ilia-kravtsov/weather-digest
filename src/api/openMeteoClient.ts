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
    'https://geocoding-api.open-meteo.com/v1/search',
  );

  url.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'ru',
    format: 'json',
  }).toString();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка вычисления геопозиции: HTTP ${response.status}`,
    );
  }

  const data = (await response.json()) as GeocodingApiResponse;

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