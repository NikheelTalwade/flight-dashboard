import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, tap } from 'rxjs';
import { FlightFilters, FlightStatusFilter } from '../../../../core/models/flight.model';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightFiltersComponent {
  readonly defaultFilters: FlightFilters = {
    callsign: '',
    status: 'ALL',
    origin: '',
    destination: '',
  };

  @Output() filtersChange = new EventEmitter<FlightFilters>();
  @Output() filteringStarted = new EventEmitter<void>();

  readonly form = new FormGroup({
    callsign: new FormControl('', { nonNullable: true }),
    status: new FormControl<FlightStatusFilter>('ALL', { nonNullable: true }),
    origin: new FormControl('', { nonNullable: true }),
    destination: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.form.valueChanges
      .pipe(
        tap(() => this.filteringStarted.emit()),
        debounceTime(200),
        map(() => this.form.getRawValue() as FlightFilters),
        takeUntilDestroyed(),
      )
      .subscribe((filters) => this.filtersChange.emit(filters));
  }

  clearAll(): void {
    this.form.reset(this.defaultFilters, { emitEvent: false });
    this.filteringStarted.emit();
    this.filtersChange.emit(this.defaultFilters);
  }
}
