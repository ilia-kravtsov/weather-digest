import type { WeatherReport } from '../types/weatherReport.js';

function getTemperatureLabel(unit: WeatherReport['temperatureUnit']): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

function getPrecipitationLabel(
  unit: WeatherReport['precipitationUnit'],
): string {
  return unit === 'inch' ? 'in' : 'мм';
}

export function formatWeatherReport(report: WeatherReport): string {
  const lines: string[] = [];

  lines.push(`Погода: ${report.city}, ${report.country}`);

  lines.push(`Координаты: ${report.latitude}, ${report.longitude}`);

  lines.push(`Часовой пояс: ${report.timezone}`);

  lines.push('');

  const temperatureLabel = getTemperatureLabel(report.temperatureUnit);

  const precipitationLabel = getPrecipitationLabel(report.precipitationUnit);

  lines.push(
    `Дата        Мин., ${temperatureLabel}   Макс., ${temperatureLabel}   Осадки, ${precipitationLabel}`,
  );

  for (const day of report.days) {
    const date = day.date.padEnd(12);

    const temperatureMin = String(day.temperatureMin).padEnd(11);

    const temperatureMax = String(day.temperatureMax).padEnd(12);

    const precipitation = String(day.precipitation);

    lines.push(`${date}${temperatureMin}${temperatureMax}${precipitation}`);
  }

  return lines.join('\n');
}
