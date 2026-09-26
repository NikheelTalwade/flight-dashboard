import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Flight, FlightFilters, KpiItem } from '../../../../core/models/flight.model';
import { ThemeService } from '../../../../core/services/theme.service';
import { FlightDashboardFacade } from '../../services/flight-dashboard.facade';
import { FlightFiltersComponent } from '../../components/flight-filters/flight-filters.component';
import { FlightKpiCardsComponent } from '../../components/flight-kpi-cards/flight-kpi-cards.component';
import { FlightMapComponent } from '../../components/flight-map/flight-map.component';
import { FlightDetailsComponent } from '../../components/flight-details/flight-details.component';
import { FlightListComponent } from '../../components/flight-list/flight-list.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatButtonToggleModule, FlightFiltersComponent, FlightKpiCardsComponent, FlightMapComponent, FlightDetailsComponent, FlightListComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly facade = inject(FlightDashboardFacade);
  private readonly themeService = inject(ThemeService);

  clusterMarkers = false;
  showAirports = false;
  showWeather = false;

  readonly currentTime = signal(new Date());
  readonly isPlaying = toSignal(this.facade.isPlaying$, { initialValue: true });
  readonly playbackSpeed = toSignal(this.facade.playbackSpeed$, { initialValue: 1 as 1 | 2 | 4 });
  readonly theme = toSignal(this.themeService.theme$, { initialValue: this.themeService.theme });
  readonly visibleFlights = toSignal(this.facade.filteredFlights$, { initialValue: [] as Flight[] });
  readonly selectedFlightId = toSignal(this.facade.selectedFlightId$, { initialValue: null as string | null });
  readonly selectedFlight = toSignal(this.facade.selectedFlight$, { initialValue: null as Flight | null });
  readonly visibleCount = computed(() => this.visibleFlights().length);
  readonly mapLoading = signal(false);
  readonly mapViewportRevision = signal(0);
  readonly kpis = toSignal(this.facade.kpis$, { initialValue: [] as KpiItem[] });
  readonly themeLabel = computed(() => (this.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));

  constructor() {
    setInterval(() => this.currentTime.set(new Date()), 1000);
    effect(() => {
      const nextFlightId = this.selectedFlightId();
      if (nextFlightId && !this.visibleFlights().some((flight) => flight.id === nextFlightId)) {
        this.facade.selectFlight(null);
      }
    });
  }

  onFilterChangeStarted(): void { this.mapLoading.set(true); }
  onFiltersChange(filters: FlightFilters): void {
    this.facade.setFilters(filters);
    this.mapViewportRevision.update((revision) => revision + 1);
  }
  onMapRendered(): void { this.mapLoading.set(false); }
  togglePlayback(): void { this.facade.togglePlayback(); }
  setPlaybackSpeed(value: string): void { this.facade.setPlaybackSpeed(Number(value) as 1 | 2 | 4); }
  toggleTheme(): void { this.themeService.toggleTheme(); }
  selectFlight(flightId: string | null): void { this.facade.selectFlight(flightId); }
}
