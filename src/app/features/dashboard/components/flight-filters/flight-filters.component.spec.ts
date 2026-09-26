import { TestBed } from '@angular/core/testing';
import { FlightFiltersComponent } from './flight-filters.component';

describe('FlightFiltersComponent', () => {
  it('announces filter activity immediately and emits values after debounce', async () => {
    await TestBed.configureTestingModule({ imports: [FlightFiltersComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FlightFiltersComponent);
    const component = fixture.componentInstance;
    let pendingEventCount = 0;
    const submittedFilters: string[] = [];

    component.filteringStarted.subscribe(() => pendingEventCount++);
    component.filtersChange.subscribe((filters) => submittedFilters.push(filters.origin));
    fixture.detectChanges();

    component.form.controls.origin.setValue('DEL');
    expect(pendingEventCount).toBe(1);
    expect(submittedFilters).toHaveLength(0);

    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(submittedFilters).toEqual(['DEL']);
    fixture.destroy();
  });
});
