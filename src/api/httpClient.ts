export interface FetchJsonOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 5000;

export async function fetchJson<T>(
  url: URL,
  options: FetchJsonOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new Error('Сервер вернул некорректный JSON');
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        `Превышено время ожидания запроса (${timeoutMs} мс)`,
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Неизвестная ошибка HTTP-запроса');
  } finally {
    clearTimeout(timeoutId);
  }
}