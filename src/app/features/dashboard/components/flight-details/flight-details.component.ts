import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Flight } from '../../../../core/models/flight.model';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe],
})
export class FlightDetailsComponent {
  @Input() flight: Flight | null = null;
}
