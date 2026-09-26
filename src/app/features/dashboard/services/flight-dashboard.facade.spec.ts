import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { FlightAnimationService } from '../../../core/services/flight-animation.service';
import { FlightDataService } from '../../../core/services/flight-data.service';
import { Flight } from '../../../core/models/flight.model';
import { FlightDashboardFacade } from './flight-dashboard.facade';
import flightsData from '../../../../assets/data/flights.json';

class StaticAnimationService {
  readonly playbackDelta$ = of(0);
  readonly isPlaying$ = of(true);
  readonly speed$ = of(1 as 1 | 2 | 4);
  animateFlight(flight: Flight, _delta: number): Flight {
    return flight;
  }
  togglePlay(): void {}
  setSpeed(_speed: 1 | 2 | 4): void {}
}

describe('FlightDashboardFacade', () => {
  let facade: FlightDashboardFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlightDashboardFacade,
        { provide: FlightDataService, useValue: { flights$: of(flightsData) } },
        { provide: FlightAnimationService, useClass: StaticAnimationService },
      ],
    });
    facade = TestBed.inject(FlightDashboardFacade);
  });

  it('returns all flights and derives KPI totals', async () => {
    const [flights, kpis] = await Promise.all([
      firstValueFrom(facade.filteredFlights$),
      firstValueFrom(facade.kpis$),
    ]);

    expect(flights).toHaveLength(20);
    expect(kpis.map((item) => item.value)).toEqual([20, 9, 5, 3]);
  });

  it('combines callsign, status, origin, and destination filters', async () => {
    facade.setFilters({ callsign: 'air india', status: 'ACTIVE', origin: 'DEL', destination: 'BOM' });
    const flights = await firstValueFrom(facade.filteredFlights$);

    expect(flights).toHaveLength(1);
    expect(flights[0].flightNumber).toBe('AI101');
  });

  it('resolves selected flights and clears selections', async () => {
    facade.selectFlight('FLC-101');
    expect((await firstValueFrom(facade.selectedFlight$))?.id).toBe('FLC-101');

    facade.clearSelection();
    expect(await firstValueFrom(facade.selectedFlight$)).toBeNull();
  });
});
