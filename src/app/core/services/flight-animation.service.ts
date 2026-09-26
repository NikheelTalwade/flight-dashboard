import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, interval, map, Observable, shareReplay, startWith } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightAnimationService {
  private readonly isPlayingSubject = new BehaviorSubject<boolean>(true);
  private readonly speedSubject = new BehaviorSubject<1 | 2 | 4>(1);
  private readonly tickSubject = new BehaviorSubject<number>(0);

  readonly isPlaying$ = this.isPlayingSubject.asObservable();
  readonly speed$ = this.speedSubject.asObservable();
  readonly playbackDelta$: Observable<number> = combineLatest([
    this.isPlaying$,
    this.speed$,
    this.tickSubject.pipe(startWith(0)),
  ]).pipe(
    map(([isPlaying, speed, tick]) => (isPlaying ? tick * speed : 0)),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor() {
    interval(800).subscribe(() => {
      if (!this.isPlayingSubject.value) {
        return;
      }

      const nextTick = this.tickSubject.value + 1;
      this.tickSubject.next(nextTick);
    });
  }

  togglePlay(): void {
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }

  setSpeed(speed: 1 | 2 | 4): void {
    this.speedSubject.next(speed);
  }

  animateFlight(flight: Flight, delta: number): Flight {
    if (flight.status === 'ARRIVED' || flight.status === 'SCHEDULED') {
      return flight;
    }

    const origin = flight.origin;
    const destination = flight.destination;
    const nextProgress = this.normalizeProgress(flight.progressPercent / 100 + delta * 0.0025);
    const lat = this.interpolate(origin.latitude, destination.latitude, nextProgress);
    const lng = this.interpolate(origin.longitude, destination.longitude, nextProgress);

    return {
      ...flight,
      currentPosition: { latitude: lat, longitude: lng },
      progressPercent: Math.min(100, Math.max(0, nextProgress * 100)),
      status: nextProgress >= 1 ? 'ARRIVED' : flight.status,
    };
  }

  private normalizeProgress(value: number): number {
    if (value >= 1) {
      return 1;
    }
    if (value <= 0) {
      return 0;
    }
    return value;
  }

  private interpolate(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }
}
