import type {
  WeatherReport,
} from '../types/weatherReport.js';

export function formatWeatherReport(
  report: WeatherReport,
): string {
  const lines: string[] = [];

  lines.push(
    `Погода: ${report.city}, ${report.country}`,
  );

  lines.push(
    `Координаты: ${report.latitude}, ${report.longitude}`,
  );

  lines.push(
    `Часовой пояс: ${report.timezone}`,
  );

  lines.push('');

  lines.push(
    'Дата        Мин., °C   Макс., °C   Осадки, мм',
  );

  for (const day of report.days) {
    const date = day.date.padEnd(12);

    const temperatureMin = String(
      day.temperatureMin,
    ).padEnd(11);

    const temperatureMax = String(
      day.temperatureMax,
    ).padEnd(12);

    const precipitation = String(
      day.precipitation,
    );

    lines.push(
      `${date}${temperatureMin}${temperatureMax}${precipitation}`,
    );
  }

  return lines.join('\n');
}