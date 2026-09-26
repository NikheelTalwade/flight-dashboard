import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from '../../../../core/models/flight.model';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightListComponent {
  @Input() flights: Flight[] = [];
  @Input() selectedFlightId: string | null = null;
  @Output() flightSelected = new EventEmitter<string>();

  selectFlight(flightId: string): void {
    this.flightSelected.emit(flightId);
  }
}
