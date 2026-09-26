import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlightStatus } from '../../../core/models/flight.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input() status: FlightStatus = 'ACTIVE';
}
