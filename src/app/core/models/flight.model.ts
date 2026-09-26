export type FlightStatus = 'ACTIVE' | 'DELAYED' | 'ARRIVED' | 'SCHEDULED';
export type FlightStatusFilter = FlightStatus | 'ALL';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Airport {
  iata: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  aircraftType: string;
  origin: Airport;
  destination: Airport;
  currentPosition: Coordinates;
  status: FlightStatus;
  estimatedDeparture: string;
  estimatedArrival: string;
  progressPercent: number;
}

export interface FlightFilters {
  callsign: string;
  status: FlightStatusFilter;
  origin: string;
  destination: string;
}

export interface KpiItem {
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'amber' | 'red';
  icon: 'fleet' | 'active' | 'delayed' | 'arrived';
}
