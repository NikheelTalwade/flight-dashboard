import { firstValueFrom, take, toArray } from 'rxjs';
import { FlightAnimationService } from './flight-animation.service';

describe('FlightAnimationService', () => {
  it('emits playback deltas while the animation is running', async () => {
    const service = new FlightAnimationService();
    service.setSpeed(2);

    const values = await firstValueFrom(
      service.playbackDelta$.pipe(take(3), toArray()),
    );

    expect(values.length).toBeGreaterThan(0);
    expect(values.some((value) => value > 0)).toBe(true);
  });
});
