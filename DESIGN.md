# Flight Operations Dashboard Design Brief

## User goal

The dashboard is designed for aviation operations personnel who need to answer three questions quickly: what is moving now, where is it moving, and which flights need attention. The primary workflow is map-first monitoring, followed by selecting a flight to inspect its route and operational details. Filters narrow the shared map, KPI, and list state without breaking the operator's context.

## Architecture

The application is an Angular 22 standalone application. The route shell lazy-loads the dashboard feature at `/dashboard`, with the root path redirecting there. `FlightDataService` loads and validates the local 20-flight dataset. `FlightAnimationService` produces playback deltas. `ThemeService` persists the light/dark preference. `FlightDashboardFacade` combines those streams with `BehaviorSubject` filter and selection state, then derives filtered flights, selected flight, airport values, result count, and KPI values.

Presentational components are intentionally separated from logic. Their TypeScript files contain inputs, outputs, subscriptions, event handlers, and state projections. Their templates and styles live in adjacent `.html` and `.scss` files. `OnPush` change detection is used throughout the dashboard components.

## Map and interaction

Leaflet is the primary visual surface. Markers show flight state and open a popup with flight number, callsign, route, and status. Selecting a marker or list item synchronizes the selected flight and draws origin-to-current-to-destination route segments. Live playback updates marker positions without repeatedly recentering the viewport. Initial fit, selection, filters, and layer changes may fit bounds; ordinary animation ticks do not. A `ResizeObserver` invalidates the Leaflet size when the responsive layout changes.

Optional layers are controlled by clear pressed-state buttons: clustering, airport markers, and deterministic weather overlays. Airport and weather markers use compact visual treatments so they do not overwhelm the flight layer.

## Visual system

The visual direction is a restrained operations console: cool neutral backgrounds, blue as the primary action color, green for healthy/live state, amber for delay and weather context, and red for exception KPIs. `DM Sans` provides readable interface text while `Space Grotesk` gives headings a compact technical character. Panels use moderate radius, translucent surfaces, light borders, and controlled shadows. Spacing follows a compact rhythm suitable for repeated operational scanning rather than a marketing layout.

The map receives the largest desktop column. Details and the internally scrollable flight list remain in a stable 300-420px sidebar. Angular Material is used for the playback action and segmented speed control while the rest of the domain-specific surfaces remain custom-styled for visual consistency.

## Responsive and accessibility decisions

The map/sidebar grid collapses below 980px. Filters reflow from four columns to two and then one. Header and playback controls wrap on small screens. Semantic `header`, `main`, `section`, `aside`, and `footer` regions are used. Controls have labels or accessible names, live state is announced, layer buttons expose `aria-pressed`, and focus-visible outlines are retained. Phone and email footer contacts are real links.

## Testing and trade-offs

The project uses Angular's unit-test builder with Vitest. Tests cover status constants, deterministic weather behavior, animation playback, and application behavior. Mock data is intentionally local and deterministic so the assessment can run without credentials or backend setup. OpenStreetMap tiles remain an external runtime dependency; an offline tile provider would require a separate tile package and much larger asset footprint.
