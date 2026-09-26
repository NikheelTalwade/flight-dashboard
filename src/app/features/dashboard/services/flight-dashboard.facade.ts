import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
import { Flight, FlightFilters, KpiItem } from '../../../core/models/flight.model';
import { FlightAnimationService } from '../../../core/services/flight-animation.service';
import { FlightDataService } from '../../../core/services/flight-data.service';

@Injectable({ providedIn: 'root' })
export class FlightDashboardFacade {
  private readonly flightDataService = inject(FlightDataService);
  private readonly animationService = inject(FlightAnimationService);

  readonly filtersState = new BehaviorSubject<FlightFilters>({
    callsign: '',
    status: 'ALL',
    origin: '',
    destination: '',
  });

  readonly selectedFlightIdState = new BehaviorSubject<string | null>(null);

  readonly flights$: Observable<Flight[]> = this.flightDataService.flights$;
  readonly filters$: Observable<FlightFilters> = this.filtersState.asObservable();
  readonly selectedFlightId$: Observable<string | null> = this.selectedFlightIdState.asObservable();

  readonly filteredFlights$: Observable<Flight[]> = combineLatest([
    this.flights$,
    this.filters$,
    this.animationService.playbackDelta$,
  ]).pipe(
    map(([flights, filters, delta]) =>
      this.applyFilters(flights, filters).map((flight) => this.animationService.animateFlight(flight, delta)),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly selectedFlight$: Observable<Flight | null> = combineLatest([
    this.filteredFlights$,
    this.selectedFlightId$,
  ]).pipe(
    map(([flights, id]) => flights.find((flight) => flight.id === id) ?? null),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly airports$: Observable<string[]> = this.filteredFlights$.pipe(
    map((flights) => {
      const airports = new Set<string>();
      flights.forEach((flight) => {
        airports.add(flight.origin.iata);
        airports.add(flight.destination.iata);
      });
      return [...airports].sort();
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly resultCount$: Observable<number> = this.filteredFlights$.pipe(
    map((flights) => flights.length),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly kpis$: Observable<KpiItem[]> = this.filteredFlights$.pipe(
    map((flights) => this.getKpis(flights)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly isPlaying$ = this.animationService.isPlaying$;
  readonly playbackSpeed$ = this.animationService.speed$;

  setFilters(filters: FlightFilters): void {
    this.filtersState.next(filters);
  }

  selectFlight(flightId: string | null): void {
    this.selectedFlightIdState.next(flightId);
  }

  clearSelection(): void {
    this.selectedFlightIdState.next(null);
  }

  togglePlayback(): void {
    this.animationService.togglePlay();
  }

  setPlaybackSpeed(speed: 1 | 2 | 4): void {
    this.animationService.setSpeed(speed);
  }

  private applyFilters(flights: Flight[], filters: FlightFilters): Flight[] {
    const normalizedCallsign = filters.callsign.trim().toLowerCase();

    return flights.filter((flight) => {
      const matchesCallsign =
        !normalizedCallsign || flight.callsign.toLowerCase().includes(normalizedCallsign);
      const matchesStatus =
        filters.status === 'ALL' || flight.status === filters.status;
      const matchesOrigin =
        !filters.origin || flight.origin.iata.toLowerCase() === filters.origin.toLowerCase();
      const matchesDestination =
        !filters.destination ||
        flight.destination.iata.toLowerCase() === filters.destination.toLowerCase();

      return matchesCallsign && matchesStatus && matchesOrigin && matchesDestination;
    });
  }

  private getKpis(flights: Flight[]): KpiItem[] {
    const activeCount = flights.filter((flight) => flight.status === 'ACTIVE').length;
    const delayedCount = flights.filter((flight) => flight.status === 'DELAYED').length;
    const arrivedCount = flights.filter((flight) => flight.status === 'ARRIVED').length;

    return [
      { label: 'Total Flights', value: flights.length, tone: 'blue', icon: 'fleet' },
      { label: 'Active Flights', value: activeCount, tone: 'green', icon: 'active' },
      { label: 'Delayed Flights', value: delayedCount, tone: 'amber', icon: 'delayed' },
      { label: 'Arrived Flights', value: arrivedCount, tone: 'red', icon: 'arrived' },
    ];
  }
}
