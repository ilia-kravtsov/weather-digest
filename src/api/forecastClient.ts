export interface ForecastDay {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
}

export interface ForecastResult {
  timezone: string;
  days: ForecastDay[];
}

interface ForecastApiResponse {
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  days: number,
): Promise<ForecastResult> {
  const url = new URL(
    'https://api.open-meteo.com/v1/forecast',
  );

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily:
      'temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: String(days),
    timezone: 'auto',
  }).toString();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка получения прогноза: HTTP ${response.status}`,
    );
  }

  const data = (await response.json()) as ForecastApiResponse;

  const forecastDays = data.daily.time.map((date, index) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[index]!,
    temperatureMin: data.daily.temperature_2m_min[index]!,
    precipitation: data.daily.precipitation_sum[index]!,
  }));

  return {
    timezone: data.timezone,
    days: forecastDays,
  };
}