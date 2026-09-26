import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { FlightDataService } from './flight-data.service';

 describe('FlightDataService', () => {
  let service: FlightDataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightDataService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FlightDataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads and validates the canonical 20-flight dataset', async () => {
    const flightsPromise = firstValueFrom(service.flights$);
    const request = http.expectOne('/assets/data/flights.json');
    request.flush([{ id: 'flight-1' }]);

    expect(await flightsPromise).toHaveLength(0);
  });

  it('falls back to bundled data when the asset request fails', async () => {
    const flightsPromise = firstValueFrom(service.flights$);
    const request = http.expectOne('/assets/data/flights.json');
    request.error(new ProgressEvent('network error'));

    expect(await flightsPromise).toHaveLength(20);
  });
});
