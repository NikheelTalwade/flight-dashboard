import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import flightsData from '../../../assets/data/flights.json';
import { Flight } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightDataService {
  private readonly http = inject(HttpClient);

  readonly flights$: Observable<Flight[]> = this.http
    .get<unknown>('/assets/data/flights.json')
    .pipe(
      map((payload) => this.validateFlights(payload)),
      catchError(() => of(this.validateFlights(flightsData))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  private validateFlights(payload: unknown): Flight[] {
    if (!Array.isArray(payload) || payload.length !== 20) {
      return [];
    }

    const flights = payload as Flight[];
    const valid = flights.every((flight) => !!flight && typeof flight.id === 'string');
    return valid ? flights : [];
  }
}
