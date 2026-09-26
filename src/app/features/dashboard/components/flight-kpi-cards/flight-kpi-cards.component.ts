import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KpiItem } from '../../../../core/models/flight.model';

@Component({
  selector: 'app-flight-kpi-cards',
  standalone: true,
  templateUrl: './flight-kpi-cards.component.html',
  styleUrl: './flight-kpi-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightKpiCardsComponent {
  @Input() items: KpiItem[] = [];
}
