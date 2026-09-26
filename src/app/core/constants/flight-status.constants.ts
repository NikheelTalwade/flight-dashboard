import { FlightStatus } from '../models/flight.model';

export const FLIGHT_STATUS_ORDER: FlightStatus[] = ['ACTIVE', 'DELAYED', 'ARRIVED', 'SCHEDULED'];

export const FLIGHT_STATUS_COLORS: Record<FlightStatus, string> = {
  ACTIVE: '#16b378',
  DELAYED: '#d98c00',
  ARRIVED: '#2f6ff2',
  SCHEDULED: '#5a6f8c',
};

export const STATUS_TONE_MAP: Record<FlightStatus, 'blue' | 'green' | 'amber' | 'red'> = {
  ACTIVE: 'green',
  DELAYED: 'amber',
  ARRIVED: 'blue',
  SCHEDULED: 'red',
};

export const WEATHER_CODES = [
  'Clear',
  'Light Rain',
  'Thunderstorm',
  'Cloudy',
  'Windy',
  'Haze',
] as const;

export function getDeterministicWeather(iata: string): { condition: string; tempC: number; windKph: number } {
  const seed = Array.from(iata).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const condition = WEATHER_CODES[seed % WEATHER_CODES.length];
  const tempC = 18 + ((seed * 7) % 19);
  const windKph = 8 + ((seed * 13) % 25);

  return { condition, tempC, windKph };
}
