import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Flight } from '../../../../core/models/flight.model';
import { getDeterministicWeather } from '../../../../core/constants/flight-status.constants';

@Component({
  selector: 'app-flight-map',
  standalone: true,
  templateUrl: './flight-map.component.html',
  styleUrl: './flight-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: true }) private mapContainerRef!: ElementRef<HTMLDivElement>;

  @Input() flights: Flight[] = [];
  @Input() selectedFlightId: string | null = null;
  @Input() selectedFlight: Flight | null = null;
  @Input() clusterMarkers = false;
  @Input() showAirports = false;
  @Input() showWeather = false;
  @Input() viewportRevision = 0;
  @Input() loading = false;

  @Output() selectedFlightChange = new EventEmitter<string | null>();
  @Output() mapRendered = new EventEmitter<void>();

  private map: L.Map | null = null;
  private aircraftLayer: L.LayerGroup = L.layerGroup();
  private routeLayer: L.LayerGroup = L.layerGroup();
  private airportLayer: L.LayerGroup = L.layerGroup();
  private weatherLayer: L.LayerGroup = L.layerGroup();
  private markerCluster: L.MarkerClusterGroup | null = null;
  private shouldFitBounds = false;
  private readonly zone = inject(NgZone);
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    this.initMap();
    this.shouldFitBounds = true;
    this.renderMap();
    this.resizeObserver = new ResizeObserver(() => {
      this.zone.runOutsideAngular(() => {
        requestAnimationFrame(() => this.map?.invalidateSize({ pan: false }));
      });
    });
    this.resizeObserver.observe(this.mapContainerRef.nativeElement);
    requestAnimationFrame(() => this.map?.invalidateSize({ pan: false }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldNotifyMapRendered = !!changes['viewportRevision'];
    if (shouldNotifyMapRendered || changes['selectedFlightId'] || changes['clusterMarkers'] || changes['showAirports'] || changes['showWeather']) {
      this.shouldFitBounds = true;
    }
    if (this.map) {
      this.renderMap();
      if (shouldNotifyMapRendered) {
        requestAnimationFrame(() => this.zone.run(() => this.mapRendered.emit()));
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.aircraftLayer.clearLayers();
    this.routeLayer.clearLayers();
    this.airportLayer.clearLayers();
    this.weatherLayer.clearLayers();
    this.markerCluster?.remove();
    this.map?.remove();
  }

  private initMap(): void {
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map(this.mapContainerRef.nativeElement, {
      center: [22.3511, 78.6677],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private renderMap(): void {
    if (!this.map) {
      return;
    }

    this.markerCluster?.clearLayers();
    this.markerCluster?.removeFrom(this.map);
    this.aircraftLayer.clearLayers();
    this.routeLayer.clearLayers();
    this.airportLayer.clearLayers();
    this.weatherLayer.clearLayers();

    const visibleFlights = this.flights ?? [];

    if (!this.clusterMarkers) {
      visibleFlights.forEach((flight) => this.aircraftLayer.addLayer(this.createFlightMarker(flight)));
    }

    if (this.selectedFlight) {
      const origin = this.selectedFlight.origin;
      const current = this.selectedFlight.currentPosition;
      const destination = this.selectedFlight.destination;
      const routePoints: L.LatLngExpression[] = [
        [origin.latitude, origin.longitude] as L.LatLngTuple,
        [current.latitude, current.longitude] as L.LatLngTuple,
        [destination.latitude, destination.longitude] as L.LatLngTuple,
      ];

      L.polyline(routePoints, { color: '#5b93ff', weight: 3, opacity: 0.9, dashArray: '6 8' }).addTo(this.routeLayer);
      L.polyline([
        [origin.latitude, origin.longitude] as L.LatLngTuple,
        [current.latitude, current.longitude] as L.LatLngTuple,
      ], { color: '#16b378', weight: 4 }).addTo(this.routeLayer);
      L.polyline([
        [current.latitude, current.longitude] as L.LatLngTuple,
        [destination.latitude, destination.longitude] as L.LatLngTuple,
      ], { color: '#d98c00', weight: 4, dashArray: '8 8' }).addTo(this.routeLayer);
    }

    if (this.showAirports) {
      this.flights.forEach((flight) => {
        const airports = [flight.origin, flight.destination];
        airports.forEach((airport) => {
          const airportMarker = L.marker([airport.latitude, airport.longitude], {
            icon: L.icon({
              iconUrl: '/leaflet/marker-icon.png',
              shadowUrl: '/leaflet/marker-shadow.png',
              iconSize: [18, 29],
              iconAnchor: [9, 29],
              popupAnchor: [1, -25],
              shadowSize: [29, 29],
            }),
          });
          airportMarker.bindPopup(`<b>${airport.iata}</b><br>${airport.name}<br>${airport.city}`);
          this.airportLayer.addLayer(airportMarker);
        });
      });
    }

    if (this.showWeather) {
      this.flights.forEach((flight) => {
        const weather = getDeterministicWeather(flight.origin.iata);
        const weatherMarker = L.marker([flight.origin.latitude, flight.origin.longitude], {
          icon: L.divIcon({
            className: 'weather-marker',
            html: `<div class="weather-marker__label">${weather.condition}</div>`,
            iconSize: [58, 22],
          }),
        });
        weatherMarker.bindPopup(`${flight.origin.iata}: ${weather.condition}, ${weather.tempC}°C, ${weather.windKph} km/h`);
        this.weatherLayer.addLayer(weatherMarker);
      });
    }

    if (this.map && this.shouldFitBounds) {
      if (this.selectedFlight) {
        const bounds = L.latLngBounds([
          [this.selectedFlight.origin.latitude, this.selectedFlight.origin.longitude],
          [this.selectedFlight.currentPosition.latitude, this.selectedFlight.currentPosition.longitude],
          [this.selectedFlight.destination.latitude, this.selectedFlight.destination.longitude],
        ]);
        this.map.fitBounds(bounds.pad(0.3), { animate: false, maxZoom: 7 });
      } else if (visibleFlights.length > 0) {
        const bounds = L.latLngBounds(visibleFlights.map((flight) => [flight.currentPosition.latitude, flight.currentPosition.longitude]));
        this.map.fitBounds(bounds.pad(0.3), { animate: false, maxZoom: 6 });
      } else {
        this.map.setView([22.3511, 78.6677], 5, { animate: false });
      }
      this.shouldFitBounds = false;
    }

    if (this.clusterMarkers) {
      const clusterLayer = this.ensureClusterLayer();
      visibleFlights.forEach((flight) => {
        const marker = this.createFlightMarker(flight);
        clusterLayer.addLayer(marker);
      });
      clusterLayer.addTo(this.map);
    } else {
      this.aircraftLayer.addTo(this.map);
    }
    this.routeLayer.addTo(this.map);
    this.airportLayer.addTo(this.map);
    this.weatherLayer.addTo(this.map);
  }

  private createFlightMarker(flight: Flight): L.Marker {
    const marker = L.marker([flight.currentPosition.latitude, flight.currentPosition.longitude], {
      icon: this.getMarkerIcon(flight.status),
    });

    marker.bindPopup(`<b>${flight.flightNumber}</b><br>${flight.callsign}<br>${flight.origin.iata} → ${flight.destination.iata}<br>${flight.status}`);
    marker.on('click', () => this.selectedFlightChange.emit(flight.id));

    if (this.selectedFlightId === flight.id) {
      marker.setZIndexOffset(1000);
    }

    return marker;
  }

  private ensureClusterLayer(): L.MarkerClusterGroup {
    if (!this.markerCluster) {
      this.markerCluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
      });
    }
    return this.markerCluster;
  }

  private getMarkerIcon(status: Flight['status']): L.DivIcon {
    return L.divIcon({
      className: `flight-marker flight-marker--${status.toLowerCase()}`,
      html: '<div class="flight-marker__dot"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }
}
