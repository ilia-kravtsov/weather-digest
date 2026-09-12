import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ClientHttpError,
  InvalidJsonError,
  NetworkError,
  ServerHttpError,
  TimeoutError,
} from '../errors/httpErrors.js';

import { fetchJson } from './httpClient.js';

describe('fetchJson', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON for a successful response', async () => {
    const data = {
      temperature: 20,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const result = await fetchJson<typeof data>(new URL('https://example.com'));

    expect(result).toEqual(data);
  });

  it('throws ClientHttpError for 4xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 404,
        statusText: 'Not Found',
      }),
    );

    await expect(
      fetchJson(new URL('https://example.com')),
    ).rejects.toBeInstanceOf(ClientHttpError);
  });

  it('throws ServerHttpError for 5xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(
      fetchJson(new URL('https://example.com')),
    ).rejects.toBeInstanceOf(ServerHttpError);
  });

  it('throws InvalidJsonError for invalid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('not valid json', {
        status: 200,
      }),
    );

    await expect(
      fetchJson(new URL('https://example.com')),
    ).rejects.toBeInstanceOf(InvalidJsonError);
  });

  it('throws NetworkError when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new TypeError('fetch failed'),
    );

    await expect(
      fetchJson(new URL('https://example.com')),
    ).rejects.toBeInstanceOf(NetworkError);
  });

  it('throws TimeoutError when request exceeds timeout', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, options) => {
      return await new Promise<Response>((_resolve, reject) => {
        const signal = options?.signal;

        signal?.addEventListener('abort', () => {
          const error = new Error('Aborted');
          error.name = 'AbortError';

          reject(error);
        });
      });
    });

    await expect(
      fetchJson(new URL('https://example.com'), {
        timeoutMs: 10,
      }),
    ).rejects.toBeInstanceOf(TimeoutError);
  });
});
