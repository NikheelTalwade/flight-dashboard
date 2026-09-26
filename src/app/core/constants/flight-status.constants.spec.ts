import { describe, expect, it } from 'vitest';
import { FLIGHT_STATUS_ORDER, getDeterministicWeather } from './flight-status.constants';

describe('flight status constants', () => {
  it('exposes the ordered flight statuses', () => {
    expect(FLIGHT_STATUS_ORDER).toEqual(['ACTIVE', 'DELAYED', 'ARRIVED', 'SCHEDULED']);
  });

  it('produces deterministic weather for an airport', () => {
    const weather = getDeterministicWeather('DEL');
    expect(weather.condition).toBeTruthy();
    expect(typeof weather.tempC).toBe('number');
    expect(typeof weather.windKph).toBe('number');
  });
});
