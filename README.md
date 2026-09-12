# Weather Digest

Weather Digest - консольная утилита на Node.js для получения прогноза погоды по одному или нескольким городам через Open-Meteo API

Утилита:

- принимает один или несколько городов через CLI;
- получает координаты города через Open-Meteo Geocoding API;
- получает прогноз погоды по координатам;
- выводит прогноз в консоль;
- сохраняет отчёт в JSON;
- использует кэш;
- поддерживает принудительное обновление через `--no-cache`;
- обрабатывает ввод нескольких городов;
- корректно обрабатывает сетевые ошибки, ошибки API и некорректные данные

## Requirements

- Node.js 20+
- npm

## Installation

Клонировать репозиторий:

```bash
git clone git@github.com:ilia-kravtsov/weather-digest.git
```

Перейти в директорию проекта:

```bash
cd weather-digest
```

Установить зависимости:

```bash
npm install
```

Создать `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

## Environment variables

| Variable | Default value | Description                                  |
| --- | --- |----------------------------------------------|
| `GEOCODING_BASE_URL` | `https://geocoding-api.open-meteo.com/v1` | Base URL for Open-Meteo Geocoding API        |
| `FORECAST_BASE_URL` | `https://api.open-meteo.com/v1` | Base URL for Open-Meteo Forecast API         |
| `REQUEST_TIMEOUT_MS` | `5000` | Request timeout in milliseconds              |
| `REPORTS_DIR` | `reports` | Directory for saved weather reports          |
| `TEMPERATURE_UNIT` | `celsius` | Temperature units: `celsius` or `fahrenheit` |
| `PRECIPITATION_UNIT` | `mm` | Precipitation units: `mm` or `inch`          |

## Running the application

### Development mode

```bash
npm run dev -- --city "Москва"
```

Указать количество дней прогноза:

```bash
npm run dev -- --city "Москва" --days 5
```

Обработать несколько городов:

```bash
npm run dev -- --city "Москва,Казань,Сочи" --days 3
```

Принудительно выполнить новый API-запрос без использования кэша:

```bash
npm run dev -- --city "Москва" --days 3 --no-cache
```

### Production build

Собрать проект:

```bash
npm run build
```

Запустить скомпилированное приложение:

```bash
npm start -- --city "Москва" --days 3
```

## CLI parameters

### `--city`

Обязательный параметр

Принимает один город или несколько городов, разделённых запятыми

Пример:

```bash
npm run dev -- --city "Москва,Казань,Сочи"
```

### `--days`

Необязательный параметр

Определяет количество дней прогноза

Значение по умолчанию:

```text
3
```

Допустимый диапазон:

```text
1-7
```

Пример:

```bash
npm run dev -- --city "Москва" --days 7
```

### `--no-cache`

Необязательный флаг

Принудительно запрашивает свежие данные из API вместо использования сохранённого отчёта за текущий день

Пример:

```bash
npm run dev -- --city "Москва" --no-cache
```

## Console output example

```text
Погода: Москва, Россия
Координаты: 55.75204, 37.61781
Часовой пояс: Europe/Moscow

Дата        Мин., °C   Макс., °C   Осадки, мм
2026-09-12  9.6        17.3        0
2026-09-13  9.3        17.1        0
2026-09-14  9.8        18.8        0

Отчёт сохранён: reports/Москва-2026-09-12.json
```

## Reports and cache

Отчёты сохраняются в формате JSON в каталоге `reports`:

```text
reports/{city}-{YYYY-MM-DD}.json
```

Например:

```text
reports/Москва-2026-09-12.json
```

Если совместимый отчёт для указанного города и количества дней уже существует за текущую дату, приложение использует его вместо повторного сетевого запроса

Для принудительного обновления данных используется флаг:

```text
--no-cache
```

## Error handling

Приложение обрабатывает следующие ситуации:

- отсутствует обязательный аргумент `--city`;
- отсутствует значение после `--city`;
- отсутствует или некорректно указано значение `--days`;
- значение `--days` находится вне диапазона `1-7`;
- город не найден;
- API возвращает HTTP 4xx;
- API возвращает HTTP 5xx;
- отсутствует сетевое соединение;
- превышено время ожидания запроса;
- неизвестный аргумент командной строки;
- API возвращает некорректный JSON.

Например:

```text
Ошибка для города "НеизвестныйГород": Город "НеизвестныйГород" не найден
```

При обработке нескольких городов ошибка одного города не прерывает обработку остальных

Если запрошены три города и второй город не существует, данные для первого и третьего города всё равно будут обработаны

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Все запрошенные города обработаны успешно |
| `1` | Произошла ошибка аргументов, сети, API или обработки данных |

Если запрошено несколько городов и хотя бы один из них завершился с ошибкой, остальные города всё равно обрабатываются, но итоговый код завершения процесса будет `1`

В Git Bash код завершения последнего запуска можно проверить командой:

```bash
echo $?
```

## Project structure

```text
src/
├── api/
│   ├── forecastClient.ts
│   ├── forecastClient.test.ts
│   ├── geocodingClient.ts
│   ├── geocodingClient.test.ts
│   ├── httpClient.ts
│   └── httpClient.test.ts
├── cli/
│   ├── parseArgs.ts
│   └── parseArgs.test.ts
├── errors/
│   └── httpErrors.ts
├── format/
│   ├── consoleFormatter.ts
│   └── consoleFormatter.test.ts
├── services/
│   ├── cityWeatherService.ts
│   ├── cityWeatherService.test.ts
│   └── weatherReportService.ts
├── storage/
│   ├── reportStorage.ts
│   └── reportStorage.test.ts
├── types/
│   └── weatherReport.ts
├── config.ts
└── index.ts
```

Основные зоны ответственности:

- `cli` - разбор и валидация аргументов командной строки;
- `api` - взаимодействие с Open-Meteo API;
- `services` - бизнес-логика получения и формирования отчёта;
- `storage` - сохранение отчётов и работа с кэшем;
- `format` - форматирование погодных данных для консольного вывода;
- `errors` - классы ошибок HTTP, сети, таймаута и некорректного JSON;
- `types` - общие TypeScript-типы приложения;
- `*.test.ts` - модульные тесты соответствующих частей проекта;
- `config.ts` - конфигурация приложения через переменные окружения;
- `index.ts` - точка входа и координация обработки нескольких городов.

## Testing

Запустить тесты:

```bash
npm test
```

Проверить сборку TypeScript:

```bash
npm run build
```

## API testing with Postman

Экспортированная коллекция Postman находится в:

```text
docs/postman/
```

Коллекция содержит два используемых приложением запроса:

- `Geocode City` - получение координат города;
- `Weather Forecast` - получение прогноза по координатам.

В коллекции используются переменные для URL и параметров запросов.

Также сохранены примеры ответов:

- успешный геокодинг;
- город не найден;
- успешное получение прогноза;
- ошибочный запрос с некорректной широтой (`400 Bad Request`).