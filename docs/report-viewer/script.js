const fileInput = document.querySelector('#report-file');
const reportSection = document.querySelector('#report');
const errorMessage = document.querySelector('#error-message');

const cityName = document.querySelector('#city-name');
const country = document.querySelector('#country');
const coordinates = document.querySelector('#coordinates');
const timezone = document.querySelector('#timezone');
const createdAt = document.querySelector('#created-at');

const minTemperatureHeading = document.querySelector(
  '#min-temperature-heading',
);

const maxTemperatureHeading = document.querySelector(
  '#max-temperature-heading',
);

const precipitationHeading = document.querySelector('#precipitation-heading');

const forecastBody = document.querySelector('#forecast-body');

function getTemperatureLabel(unit) {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

function getPrecipitationLabel(unit) {
  return unit === 'inch' ? 'in' : 'мм';
}

function clearForecastTable() {
  forecastBody.replaceChildren();
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  reportSection.hidden = true;
}

function hideError() {
  errorMessage.hidden = true;
}

function createTableCell(value) {
  const cell = document.createElement('td');
  cell.textContent = String(value);

  return cell;
}

function renderForecast(days) {
  clearForecastTable();

  for (const day of days) {
    const row = document.createElement('tr');

    row.append(
      createTableCell(day.date),
      createTableCell(day.temperatureMin),
      createTableCell(day.temperatureMax),
      createTableCell(day.precipitation),
    );

    forecastBody.append(row);
  }
}

function renderReport(report) {
  const temperatureLabel = getTemperatureLabel(report.temperatureUnit);

  const precipitationLabel = getPrecipitationLabel(report.precipitationUnit);

  cityName.textContent = report.city;
  country.textContent = report.country;
  coordinates.textContent = `${report.latitude}, ${report.longitude}`;
  timezone.textContent = report.timezone;
  createdAt.textContent = new Date(report.createdAt).toLocaleString('ru-RU');

  minTemperatureHeading.textContent = `Мин. температура, ${temperatureLabel}`;

  maxTemperatureHeading.textContent = `Макс. температура, ${temperatureLabel}`;

  precipitationHeading.textContent = `Осадки, ${precipitationLabel}`;

  renderForecast(report.days);

  reportSection.hidden = false;
}

function isWeatherReport(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.city === 'string' &&
    typeof value.country === 'string' &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number' &&
    typeof value.timezone === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.temperatureUnit === 'string' &&
    typeof value.precipitationUnit === 'string' &&
    Array.isArray(value.days)
  );
}

fileInput.addEventListener('change', async () => {
  hideError();

  const file = fileInput.files?.[0];

  if (!file) {
    reportSection.hidden = true;
    return;
  }

  try {
    const content = await file.text();
    const report = JSON.parse(content);

    if (!isWeatherReport(report)) {
      throw new Error('Некорректная структура отчёта');
    }

    renderReport(report);
  } catch (error) {
    if (error instanceof Error) {
      showError(`Не удалось прочитать отчёт: ${error.message}`);
      return;
    }

    showError('Не удалось прочитать отчёт');
  }
});
