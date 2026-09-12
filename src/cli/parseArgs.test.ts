import { describe, expect, it } from 'vitest';
import { parseArgs } from './parseArgs.js';

describe('parseArgs', () => {
  it('parses a single city', () => {
    const result = parseArgs(['--city', 'Москва']);

    expect(result).toEqual({
      cities: ['Москва'],
      days: 3,
      noCache: false,
    });
  });

  it('parses multiple comma-separated cities', () => {
    const result = parseArgs(['--city', 'Москва, Казань, Нижний Новгород']);

    expect(result.cities).toEqual(['Москва', 'Казань', 'Нижний Новгород']);
  });

  it('uses 3 days by default', () => {
    const result = parseArgs(['--city', 'Москва']);

    expect(result.days).toBe(3);
  });

  it('parses the days option', () => {
    const result = parseArgs(['--city', 'Москва', '--days', '7']);

    expect(result.days).toBe(7);
  });

  it('parses the no-cache flag', () => {
    const result = parseArgs(['--city', 'Москва', '--no-cache']);

    expect(result.noCache).toBe(true);
  });

  it('throws if city option is missing', () => {
    expect(() => parseArgs(['--days', '3'])).toThrow(
      'Необходимо указать --city',
    );
  });

  it('throws if city value is missing', () => {
    expect(() => parseArgs(['--city', '--days', '3'])).toThrow(
      'Необходимо указать город после --city',
    );
  });

  it('throws if days value is missing', () => {
    expect(() => parseArgs(['--city', 'Москва', '--days'])).toThrow(
      'Необходимо указать количество дней после --days',
    );
  });

  it('throws if days is less than 1', () => {
    expect(() => parseArgs(['--city', 'Москва', '--days', '0'])).toThrow(
      '--days должен быть целым числом от 1 до 7',
    );
  });

  it('throws if days is greater than 7', () => {
    expect(() => parseArgs(['--city', 'Москва', '--days', '8'])).toThrow(
      '--days должен быть целым числом от 1 до 7',
    );
  });

  it('throws if days is not a number', () => {
    expect(() => parseArgs(['--city', 'Москва', '--days', 'abc'])).toThrow(
      '--days должен быть целым числом от 1 до 7',
    );
  });

  it('throws if days is not an integer', () => {
    expect(() => parseArgs(['--city', 'Москва', '--days', '2.5'])).toThrow(
      '--days должен быть целым числом от 1 до 7',
    );
  });

  it('throws an error for unknown argument', () => {
    expect(() => parseArgs(['--city', 'Москва', '--no-cachee'])).toThrow(
      'Неизвестный аргумент: --no-cachee',
    );
  });
});
