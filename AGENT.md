# Flight Operations Dashboard Generation Guide

## Purpose

This is a portable, machine-independent generation specification for GitHub Copilot. Copy this file to a new empty workspace on another machine and use it to generate the complete application from scratch. The source repository, screenshots, build output, local paths, and files from the original machine are not required for learning or generation.

The goal is to reproduce the Flight Operations Dashboard in functionality, layout, interaction, visual design, data, and behavior. Treat this document as the product and implementation contract, not as a request to inspect another repository.

Do not redesign, simplify, rename, replace the state model, or introduce a different UI style unless the user explicitly requests a change.

## Assessment Traceability

This specification is derived from the Flight Tracking & Operations Dashboard assessment. Every assessment requirement maps to an implementation requirement below:

| Assessment requirement | Generation requirement |
| --- | --- |
| Angular 16+ | Use Angular 22 standalone components; Angular 22 satisfies the Angular 16+ requirement. |
| TypeScript | Use strict TypeScript interfaces and typed RxJS streams. |
| Reactive Forms | Implement `FlightFiltersComponent` with a non-nullable reactive form and debounced `valueChanges`. |
| Routing | Provide `/dashboard` and redirect the empty path to it. |
| Services | Create `FlightDataService`, `FlightAnimationService`, `ThemeService`, and `FlightDashboardFacade`. |
| RxJS | Use `Observable`, `BehaviorSubject`, `combineLatest`, `map`, `debounceTime`, `distinctUntilChanged`, `shareReplay`, and the playback interval. |
| Leaflet map | Implement `FlightMapComponent` with Leaflet, OpenStreetMap tiles, controls, markers, popups, routes, and layer groups. |
| 15–20 mock flights | Generate exactly the canonical 20-flight Indian dataset in this document. |
| Flight marker information | Aircraft marker popup shows flight number, callsign, route, and status; marker selection emits the flight ID. |
| Selected route visualization | Draw origin → current position → destination with separate flown/remaining route polylines and fit the route once. |
| Flight details | Show flight number, callsign, aircraft type, origin, destination, current status, estimated departure, estimated arrival, and progress. |
| Operations KPIs | Show Total Flights, Active Flights, Delayed Flights, and Arrived Flights from the filtered set. |
| Search and filters | Support callsign, status, origin airport, and destination airport with AND-combined filtering. |
| Map primary focus | Use the left `2fr` content column for the map and a `300px–420px` sidebar for details/list on desktop. |
| Professional side panel | Use the premium glass details panel and internally scrollable flight list. |
| Responsive desktop/tablet UI | Collapse the content grid at `980px`, reflow filters at `920px` and `560px`, and reflow header actions at `640px`. |
| Accessibility and UX | Use semantic regions, labels, keyboard focus, live regions, accessible icon buttons, stable sizing, empty states, and reduced-motion support. |
| Optional playback | Implemented and enabled by default. |
| Optional dark mode | Implemented and persisted under `flight-ops-theme`. |
| Optional clustering | Implemented with `leaflet.markercluster`, toggleable and default off. |
| Optional airport markers | Implemented, toggleable and default off. |
| Optional weather overlay | Implemented with deterministic local mock data, toggleable and default off. |
| Optional unit tests | Implement tests for constants, services, facade, and deterministic weather helper. |


## Clean-Machine Generation Mode

When this file is supplied in a new workspace:

1. Create a new Angular 22 standalone application using TypeScript.
2. Install the dependencies listed in this document.
3. Create the folder structure and files described below.
4. Implement the data model and 20-record mock dataset before building the UI.
5. Implement services and the RxJS facade before connecting presentational components.
6. Implement the shared SCSS design system before component-specific styling.
7. Implement the dashboard page, map, filters, details, list, playback, theme, and map layers.
8. Add the tests described in the Testing Contract.
9. Run the required build and test commands.
10. Visually verify desktop and mobile layouts, filters, selection, playback, theme switching, and map zoom/pan stability.

Do not ask for access to the original machine or repository. Do not infer missing behavior from external screenshots. Everything required for the recreation is specified here.

## Application Identity

- Product: Flight Operations Dashboard
- Domain: Real-time airline operations monitoring
- Framework: Angular 22 standalone components
- Language: TypeScript
- State: RxJS facade using `BehaviorSubject`, `combineLatest`, `map`, and `shareReplay`
- Map: Leaflet with `leaflet.markercluster`
- Tests: Vitest through Angular's `@angular/build:unit-test`
- Data source: local mock JSON only; no backend and no API key
- Dataset: exactly 20 Indian domestic flight records
- Primary route: `/dashboard`
- Footer identity: `© 2026 @nikheel-talwade`
- Contact phone: `9591241878`
- Contact email: `nikheeltalwade.sde@gmail.com`

## Required Commands

```bash
npm install
npm start
npm run build
npm test -- --watch=false
```

The app must build successfully and the test suite must pass before considering a generated version complete.

## Assessment Deliverables

Generate these submission artifacts in addition to the application source:

### README.md

Include:

- Project title and one-paragraph purpose.
- Feature list covering required and implemented bonus features.
- Prerequisites and exact setup commands.
- Development, production build, and test commands.
- Local URL and route (`http://localhost:4200/dashboard`).
- Project structure overview.
- Mock-data explanation stating that no backend or API key is required.
- Asset-path troubleshooting for `/assets/data/flights.json` and `/leaflet/*`.
- Screenshots section with links to generated screenshots.
- Repository link placeholder:

 ```text
 Repository: <add the GitHub repository URL after creating the repository>
 ```

Do not invent a GitHub URL. The repository link is a submission step performed by the developer after publishing the generated project.

### DESIGN.md

Write a concise 1–2 page design explanation covering:

- User goal and operations-center workflow.
- Angular architecture and smart/presentational component split.
- RxJS facade data flow.
- Leaflet map and route interaction.
- Responsive layout strategy.
- Typography, color tokens, panels, spacing, icons, and motion.
- Accessibility decisions.
- Testing and trade-offs.

### Screenshots or demo

After starting the app, capture at least these screenshots under `docs/screenshots/`:

- Desktop overview in light mode.
- Desktop overview in dark mode.
- Selected flight with route and details panel.
- Filtered flight state showing KPI/list/map synchronization.
- Map layer state showing airport markers, clustering, or weather.
- Mobile or tablet responsive layout.

Link the screenshots from `README.md`. A short demo video is optional; if a video cannot be generated automatically, document the manual recording steps in the README rather than claiming that a video exists.

### Submission checklist

- Source code is committed to a GitHub repository by the developer.
- README contains the real repository URL after publication.
- DESIGN.md is approximately 1–2 pages when rendered.
- Screenshots show the actual generated application, not placeholder mockups.
- `npm test -- --watch=false` passes.
- `npx ng build --configuration development` passes.

## Complete Project Manifest

When generating from an empty workspace, create this project shape. File names and responsibilities should remain stable:

```text
angular.json
package.json
README.md
DESIGN.md
AGENT.md
tsconfig.json
tsconfig.app.json
tsconfig.spec.json
public/favicon.ico
src/
 index.html
 main.ts
 styles.scss
 assets/data/flights.json
 app/
 app.ts
 app.html or inline root template
 app.scss or minimal root styles
 app.config.ts
 app.routes.ts
 app.spec.ts
 core/
 constants/flight-status.constants.ts
 constants/flight-status.constants.spec.ts
 constants/weather.util.ts
 constants/weather.util.spec.ts
 models/flight.model.ts
 services/flight-data.service.ts
 services/flight-data.service.spec.ts
 services/flight-animation.service.ts
 services/flight-animation.service.spec.ts
 services/theme.service.ts
 services/theme.service.spec.ts
 features/dashboard/
 dashboard.routes.ts
 components/flight-details/flight-details.component.ts
 components/flight-filters/flight-filters.component.ts
 components/flight-kpi-cards/flight-kpi-cards.component.ts
 components/flight-list/flight-list.component.ts
 components/flight-map/flight-map.component.ts
 pages/dashboard-page/dashboard-page.component.ts
 services/flight-dashboard.facade.ts
 services/flight-dashboard.facade.spec.ts
 shared/components/empty-state/empty-state.component.ts
 shared/components/status-badge/status-badge.component.ts
```

Small Angular-version-specific differences are acceptable only when required by the installed Angular CLI. Preserve the responsibilities and observable behavior of every listed file.

## Exact Routing and Bootstrap

- `main.ts` must use `bootstrapApplication(AppComponent, appConfig)`.
- `app.config.ts` must provide `provideHttpClient()`, `provideRouter(appRoutes)`, and `provideZoneChangeDetection({ eventCoalescing: true })`.
- `app.routes.ts` must route the dashboard feature at `/dashboard` and redirect the empty path to `/dashboard`.
- `dashboard.routes.ts` must lazy-load or expose `DashboardPageComponent` without changing the public URL.
- `angular.json` must use `@angular/build:application` for build, `@angular/build:dev-server` for serve, and `@angular/build:unit-test` for tests.
- The browser build must include `zone.js` in `polyfills`.
- HTTP assets must be copied from `src/assets` to `/assets`.
- Leaflet images must be copied from `node_modules/leaflet/dist/images` to `/leaflet`.

Use this exact `angular.json` build-options shape:

```json
{
 "builder": "@angular/build:application",
 "options": {
 "browser": "src/main.ts",
 "polyfills": [
 "zone.js"
 ],
 "tsConfig": "tsconfig.app.json",
 "inlineStyleLanguage": "scss",
 "assets": [
 {
 "glob": "**/*",
 "input": "public"
 },
 {
 "glob": "**/*",
 "input": "src/assets",
 "output": "assets"
 },
 {
 "glob": "**/*",
 "input": "node_modules/leaflet/dist/images",
 "output": "leaflet"
 }
 ],
 "styles": [
 "src/styles.scss"
 ]
 }
}
```

The three asset entries have distinct purposes:

- `public` copies static public files such as `favicon.ico`.
- `src/assets` makes `src/assets/data/flights.json` available at `/assets/data/flights.json`.
- Leaflet's image folder makes `marker-icon.png`, `marker-icon-2x.png`, and `marker-shadow.png` available at `/leaflet/`.

Do not place `flights.json` only in `public/` and do not omit the `output` values. The service URL and Leaflet icon URLs depend on these exact output paths.

## Exact Domain Contracts

Implement these TypeScript concepts:

```ts
type FlightStatus = 'ACTIVE' | 'DELAYED' | 'ARRIVED' | 'SCHEDULED';
type FlightStatusFilter = FlightStatus | 'ALL';

interface Coordinates {
 latitude: number;
 longitude: number;
}

interface Airport {
 iata: string;
 name: string;
 city: string;
 latitude: number;
 longitude: number;
}

interface Flight {
 id: string;
 flightNumber: string;
 callsign: string;
 aircraftType: string;
 origin: Airport;
 destination: Airport;
 currentPosition: Coordinates;
 status: FlightStatus;
 estimatedDeparture: string;
 estimatedArrival: string;
 progressPercent: number;
}

interface FlightFilters {
 callsign: string;
 status: FlightStatusFilter;
 origin: string;
 destination: string;
}
```

KPI cards must expose a label, number, tone (`blue | green | amber | red`), and icon (`fleet | active | delayed | arrived`).

## Service and Facade Contracts

### FlightDataService

- Inject `HttpClient`.
- Expose `flights$: Observable<Flight[]>`.
- Request `/assets/data/flights.json`.
- Reject non-arrays and datasets whose length is not exactly 20.
- Return `[]` through `catchError` for HTTP or validation failures.
- Cache with `shareReplay({ bufferSize: 1, refCount: true })`.

### FlightAnimationService

- Start with `isPlaying = true` and speed `1`.
- Tick approximately every 600ms.
- Expose `isPlaying$`, `speed$`, and a playback tick/delta stream.
- `togglePlay()` switches playback.
- `setSpeed(1 | 2 | 4)` changes the multiplier.
- Interpolate latitude/longitude between origin and destination.
- Move only `ACTIVE` and `DELAYED` flights.
- Return unchanged values for `ARRIVED` and `SCHEDULED` flights.
- Wrap progress safely when it reaches 100%.

### ThemeService

- Theme type is `light | dark`.
- Storage key is `flight-ops-theme`.
- Restore stored theme when valid.
- Otherwise use `prefers-color-scheme: dark` when available, falling back to light.
- Set `document.documentElement[data-theme]` on construction and every theme change.
- Expose the current theme and a theme observable.

### FlightDashboardFacade

Own these state subjects:

- `filtersState`, initialized with callsign `''`, status `ALL`, origin `''`, destination `''`.
- `selectedFlightIdState`, initialized with `null`.

Expose these streams:

- `flights$`
- `filters$`
- `selectedFlightId$`
- `filteredFlights$`
- `selectedFlight$`
- `airports$`
- `resultCount$`
- `kpis$`
- `isPlaying$`
- `playbackSpeed$`

Expose methods for setting filters, selecting/clearing a flight, toggling playback, and setting playback speed. The facade is the only place where filtering and KPI calculations are implemented.

## Component Contracts

### DashboardPageComponent

Owns page composition and connects the facade to child components. It must render the brand/header, live clock, status strip, KPI cards, filters, playback controls, layer toggles, map, details, list, and root footer.

Required state defaults:

```ts
clusterMarkers = false;
showAirports = false;
showWeather = false;
```
### FlightFiltersComponent

- Standalone and `OnPush`.
- Uses a non-nullable reactive form.
- Emits `FlightFilters` after a 200ms debounce.
- Uses `distinctUntilChanged` to avoid duplicate emissions.
- Has Callsign, Status, Origin, and Destination controls.
- Clear All resets and emits the default filter state.

### FlightKpiCardsComponent

- Renders four responsive cards.
- Uses the KPI tone and icon supplied by the facade.
- Uses shared card and icon classes, not duplicated panel styling.

### FlightMapComponent

- Standalone, `OnPush`, implements `AfterViewInit`, `OnChanges`, and `OnDestroy`.
- Inputs: flights, selected flight ID, selected flight, clusterMarkers, showAirports, showWeather.
- Output: selected flight ID.
- Initializes Leaflet over India around `[22.3511, 78.6677]` at zoom `5`.
- Uses OpenStreetMap tiles with attribution.
- Uses explicit Leaflet marker image URLs under `/leaflet/`.
- Uses separate layers for aircraft, routes, airports, and weather.
- Clears layers before rebuilding them.
- Auto-fits only when visible flight IDs or selected flight ID changes.
- Never auto-fits on position-only animation updates.
- Cleans up all layers and the map instance in `ngOnDestroy`.

### FlightDetailsComponent

- Shows an empty state if no flight is selected.
- Otherwise shows profile header, status badge, route progress track, and all flight metadata.
- The plane on the route track is positioned from `progressPercent`.

### FlightListComponent

- Shows filtered count and all visible flights.
- Uses a fixed-height internal scroll area of approximately 420px.
- Selecting a row emits the flight ID.
- Selected row has a visible accent border/ring.
- Shows empty state text when there are no matches.

### StatusBadgeComponent and EmptyStateComponent

- Both are standalone, reusable, and `OnPush`.
- Status badge uses the shared status color mapping and includes a status dot.
- Empty state uses a plane SVG icon, heading, message, and accessible live status.

## Footer Contract

The root application template must render the footer below the router outlet on every route:

- `© 2026 @nikheel-talwade. All rights reserved.`
- Phone link: `tel:+919591241878`, displayed as `9591241878`.
- Email link: `mailto:nikheeltalwade.sde@gmail.com`, displayed as `nikheeltalwade.sde@gmail.com`.
- Use inline SVG phone and mail icons.
- Keep the footer responsive, theme-aware, keyboard accessible, and visually consistent with the dashboard.

## Functional Contract

### Dashboard

The first screen is the operations dashboard. It must include:

- Premium operations header with a gradient aircraft brand mark.
- Live/Paused indicator with a pulsing status dot.
- Ticking current time in the header.
- Dark/light theme toggle using an icon-only circular button with an accessible label.
- Visible-flight count strip.
- Four KPI cards:
 - Total flights
 - Active flights
 - Delayed flights
 - Arrived flights
- Filter panel.
- Playback and map-layer control strip.
- Live map panel.
- Flight details panel.
- Scrollable flight list.
- Footer with `© 2026 @nikheel-talwade`, phone link `tel:+919591241878`, and email link `mailto:nikheeltalwade.sde@gmail.com`.

### Data

Create `src/assets/data/flights.json` as the mock data source.

Preserve these data requirements:

- Exactly 20 records.
- Indian airports and cities.
- Indian airline callsigns such as Air India, IndiGo, SpiceJet, Vistara, GoFirst, Akasa, AirAsia India, and Alliance Air.
- Every record must have:
 - `id`
 - `flightNumber`
 - `callsign`
 - `aircraftType`
 - `origin`
 - `destination`
 - `currentPosition`
 - `status`
 - `estimatedDeparture`
 - `estimatedArrival`
 - `progressPercent`
- Airport objects must contain IATA code, name, city, latitude, and longitude.
- Keep all coordinates geographically correct and consistent with the route.
- Keep the four statuses: `ACTIVE`, `DELAYED`, `ARRIVED`, `SCHEDULED`.

`FlightDataService` must request `/assets/data/flights.json`, validate that the response is an array of exactly 20 flights, cache it with `shareReplay`, and fall back to an empty array on request or validation failure.

### Canonical Flight Manifest

Generate these exact 20 records in this order. Use the listed IATA routes, callsigns, statuses, and progress values. Add geographically correct airport names, cities, and coordinates for every IATA code; interpolate `currentPosition` between origin and destination from `progressPercent` for active or delayed flights. Arrived flights use the destination position. Scheduled flights may use a low-progress position on the route.

| ID | Flight | Callsign | Route | Status | Progress |
| --- | --- | --- | --- | --- | ---: |
| FLC-101 | AI101 | AIR INDIA 101 | DEL → BOM | ACTIVE | 62 |
| FLC-102 | 6E204 | INDIGO 204 | BLR → HYD | ACTIVE | 48 |
| FLC-103 | SG312 | SPICEJET 312 | MAA → CCU | DELAYED | 57 |
| FLC-104 | UK452 | VISTARA 452 | DEL → AMD | ARRIVED | 100 |
| FLC-105 | G8322 | GOFIRST 322 | BOM → GOI | ACTIVE | 74 |
| FLC-106 | I5588 | AIRASIA 588 | CCU → PAT | DELAYED | 53 |
| FLC-107 | 9I613 | ALLIANCE 613 | HYD → PNQ | SCHEDULED | 18 |
| FLC-108 | QP222 | AKASA 222 | AMD → JAI | ACTIVE | 61 |
| FLC-109 | AI349 | AIR INDIA 349 | COK → MAA | ARRIVED | 100 |
| FLC-110 | SG822 | SPICEJET 822 | DEL → LKO | ACTIVE | 34 |
| FLC-111 | 6E445 | INDIGO 445 | BOM → IXC | DELAYED | 51 |
| FLC-112 | UK502 | VISTARA 502 | BLR → GOI | SCHEDULED | 11 |
| FLC-113 | AI719 | AIR INDIA 719 | HYD → VNS | ACTIVE | 72 |
| FLC-114 | UK991 | VISTARA 991 | PNQ → NAG | DELAYED | 65 |
| FLC-115 | 6E118 | INDIGO 118 | CCU → GAU | ACTIVE | 48 |
| FLC-116 | SG844 | SPICEJET 844 | MAA → TRV | ARRIVED | 100 |
| FLC-117 | I5217 | AIRASIA 217 | DEL → SXR | ACTIVE | 43 |
| FLC-118 | AI205 | AIR INDIA 205 | BOM → RPR | SCHEDULED | 23 |
| FLC-119 | QP619 | AKASA 619 | GOI → BLR | DELAYED | 52 |
| FLC-120 | G8841 | GOFIRST 841 | JAI → LKO | ACTIVE | 68 |

The canonical dataset should produce these initial status totals: 20 total, 9 active, 5 delayed, 3 arrived, and 3 scheduled.

### Filtering

Filters must update all dependent views from the same derived stream:

- Callsign: debounced, case-insensitive substring search.
- Status: All, Active, Delayed, Arrived, Scheduled.
- Origin: IATA dropdown.
- Destination: IATA dropdown.
- Multiple filters combine with AND logic.
- Clear all restores the default filter state.
- KPI cards, map markers, map count, selected flight resolution, and flight list must update together.
- Show a clear empty state when no flights match.

### Playback

Playback is part of the default experience:

- Animation starts playing automatically on application load.
- Play/Pause button toggles the animation.
- Playback speeds are 1x, 2x, and 4x.
- `ACTIVE` and `DELAYED` flights move along the origin-to-destination route.
- `ARRIVED` and `SCHEDULED` flights do not move.
- Aircraft markers transition smoothly rather than snapping.
- The live indicator changes between Live and Paused.
- Do not reset the user's map view on every animation tick.

### Map Stability

This behavior is critical:

- Use Leaflet centered on India initially.
- Support manual zoom in, zoom out, pan, and marker interaction.
- Auto-fit bounds only when the visible flight ID set changes or the selected flight changes.
- Never call `fitBounds` on every playback position update.
- Selecting a flight may fit the selected route once.
- After selection, playback must not fight manual zoom or pan.
- Use a stable map container with a minimum height of approximately 460px.
- Include OpenStreetMap attribution.

### Map Layers

The control strip must include toggleable layers:

- Cluster markers: available, default `false`.
- Airport markers: available, default `false`.
- Weather overlay: available, default `false`.

Do not silently change these current defaults without an explicit request.

Map behavior:

- Aircraft markers use status colors and show a popup with flight number, callsign, route, and status.
- Airport markers represent visible origin/destination airports and show airport details in a popup.
- Weather is deterministic mock data generated from airport IATA codes; do not add an external weather API requirement.
- Clustering uses `leaflet.markercluster` and must remain toggleable.

### Selection and Details

A flight can be selected from either the flight list or an aircraft marker.

Selection must:

- Highlight the selected flight marker.
- Draw the selected route as origin → current position → destination.
- Fit the map to the selected route once.
- Populate the details panel.
- Show flight number, callsign, aircraft, origin, destination, departure, arrival, progress, and status.
- Show the route progress track with a plane icon positioned using `progressPercent`.

### Theme

Dark mode must:

- Toggle from the header icon button.
- Persist in `localStorage` under the key `flight-ops-theme`.
- Respect the OS color-scheme preference on first load when there is no stored preference.
- Use the same layout and component structure in both themes.
- Preserve readable contrast for panels, text, inputs, map controls, list items, status badges, and footer.

## Architecture Contract

Use these folder responsibilities:

```text
src/app/
 core/
 constants/ status constants and deterministic weather helper
 models/ domain interfaces and types
 services/ flight data, animation, and theme services
 features/
 dashboard/
 components/ filters, KPI cards, map, details, list
 pages/ dashboard page/container
 services/ FlightDashboardFacade
 shared/
 components/ status badge and empty state
src/assets/data/flights.json
src/styles.scss
```

Implement this smart/presentational split:

- `DashboardPageComponent` owns facade subscriptions, page-level interactions, theme state, playback controls, and map-layer toggles.
- Presentational components receive data through `@Input()` and emit actions through `@Output()`.
- Use `ChangeDetectionStrategy.OnPush` for components.
- Use the `async` pipe in templates instead of manual subscriptions where practical.
- Keep filtering and derived state in `FlightDashboardFacade`, not duplicated in UI components.
- Prefer `inject()` for services when a field initializer depends on the service.

## Visual Design Contract

The application has a premium real-time operations-center visual language. Preserve it.

### Typography

- Load these Google Fonts in `src/index.html`:
 - `Inter:wght@400;500;600;700;800` for all UI text.
 - `JetBrains Mono:wght@500` for flight codes, IATA route codes, and the live clock.
- Use this font stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Use this monospace stack: `"JetBrains Mono", ui-monospace, monospace`.
- Set the document base font size to `15px` and enable antialiasing.
- Body letter spacing is `-0.01em`; headings use `font-weight: 800` and `letter-spacing: -0.02em`.
- Main page heading: responsive `clamp(1.6rem, 2.4vw, 2.2rem)`, weight 800.
- Section headings: weight 800, compact line height, no oversized hero typography.
- Eyebrow labels: `0.7rem`, weight 800, uppercase, `0.1em` letter spacing.
- Metadata text: `0.8rem`, muted color, line height approximately `1.55`.
- Buttons: `0.88rem`, weight 700.
- Do not introduce Arial, Roboto, default browser typography, decorative display fonts, or oversized marketing typography.

### Palette and surfaces

Use these exact design tokens in `src/styles.scss`; do not replace them with approximate colors:

#### Light theme

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `hashtag#eef2fb` | Base page color |
| `--bg-gradient` | `radial-gradient(1200px 600px at 8% -10%, hashtag#e4ecff 0%, transparent 55%), radial-gradient(1000px 700px at 100% 0%, hashtag#eafcf6 0%, transparent 50%), hashtag#eef2fb` | Fixed atmospheric page background |
| `--panel` | `hashtag#ffffff` | Cards, inputs, list rows |
| `--panel-soft` | `rgba(255, 255, 255, 0.82)` | Glass panels |
| `--border` | `hashtag#dde5f2` | Standard borders |
| `--border-strong` | `hashtag#cdd8ea` | Controls and emphasized borders |
| `--text` | `hashtag#101b2d` | Primary text |
| `--muted` | `hashtag#5a6f8c` | Secondary text |
| `--navy` | `hashtag#0d1b2e` | Brand/airport marker dark tone |
| `--input-bg` | `hashtag#ffffff` | Input and select backgrounds |
| `--accent` | `hashtag#2f6ff2` | Primary blue |
| `--accent-strong` | `hashtag#1f4fd6` | Strong accent text |
| `--accent-gradient` | `linear-gradient(135deg, hashtag#3b7bff 0%, hashtag#6d5bf5 100%)` | Brand and primary controls |
| `--success` | `hashtag#16b378` | Live and arrived states |
| `--amber` | `hashtag#d98c00` | Delayed state |
| `--danger` | `hashtag#e0455e` | Error/danger state |

#### Dark theme

Apply these values under `[data-theme='dark']`:

| Token | Value |
| --- | --- |
| `color-scheme` | `dark` |
| `--bg` | `hashtag#0a121e` |
| `--bg-gradient` | `radial-gradient(1200px 600px at 8% -10%, #142238 0%, transparent 55%), radial-gradient(1000px 700px at 100% 0%, hashtag#0f2a24 0%, transparent 50%), hashtag#0a121e` |
| `--panel` | `hashtag#131d2e` |
| `--panel-soft` | `rgba(19, 29, 46, 0.82)` |
| `--border` | `#263650` |
| `--border-strong` | `#304264` |
| `--text` | `hashtag#edf2fb` |
| `--muted` | `hashtag#93a7c4` |
| `--navy` | `hashtag#edf2fb` |
| `--input-bg` | `hashtag#0e1728` |
| `--accent` | `hashtag#5b93ff` |
| `--accent-strong` | `hashtag#7ea3ff` |
| `--accent-gradient` | `linear-gradient(135deg, hashtag#4d7dff 0%, hashtag#8b6bff 100%)` |
| `--success` | `hashtag#2fd699` |
| `--amber` | `hashtag#ffb443` |
| `--danger` | `hashtag#ff6b83` |

Both themes must use the same component geometry. Only the tokens change.

#### Shape, shadow, and spacing tokens

```scss
--shadow-sm: 0 1px 3px rgba(16, 27, 45, 0.06), 0 1px 2px rgba(16, 27, 45, 0.04);
--shadow-md: 0 8px 24px rgba(16, 27, 45, 0.08), 0 2px 6px rgba(16, 27, 45, 0.05);
--shadow-lg: 0 20px 48px rgba(16, 27, 45, 0.14), 0 6px 16px rgba(16, 27, 45, 0.08);
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 20px;
```

- Use the dark-theme shadow equivalents from the current shared stylesheet: `--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.35)`, `--shadow-md: 0 10px 28px rgba(0, 0, 0, 0.4)`, and `--shadow-lg: 0 24px 56px rgba(0, 0, 0, 0.5)`.
- Page background is fixed while scrolling: `background-attachment: fixed`.
- Glass panels use `backdrop-filter: blur(16px) saturate(160%)` and `-webkit-backdrop-filter`.
- Do not use large rounded cards inside other rounded cards. Panels are the main layout surfaces; cards are individual repeated items.

### Shared styling

Define and use these shared classes in `src/styles.scss`:

- `.surface-panel`
- `.surface-panel--flush`
- `.panel-header`
- `.eyebrow`
- `.badge-count`
- `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-subtle`
- `.icon-btn`
- `.pill-toggle`
- `.form-field`, `.input-icon`
- `.grid-responsive-2`, `.grid-responsive-4`
- `.card`
- `.scroll-list`
- `.list-item-card`
- `.item-row`, `.item-meta`
- `.live-dot`
- `.brand`, `.kpi-icon`

Do not duplicate these definitions inside component styles. Keep component-local styles only for genuinely unique structure, such as map sizing, route-track geometry, KPI tone colors, or status-badge internals.

### Stylesheet value fidelity

Creating a file named `src/styles.scss` is not sufficient. The generated stylesheet must implement the actual values specified in this document.

Copilot must reproduce all of the following exactly:

- The complete light-theme token values in the Light Theme table.
- The complete dark-theme token values in the Dark Theme table.
- The `--shadow-*`, `--radius-*`, `--font-*`, and gradient values in the token blocks.
- The `Inter` and `JetBrains Mono` font imports and font stacks.
- The shared class geometry and behavior listed below.

```scss
.surface-panel {
 background: var(--panel-soft);
 backdrop-filter: blur(16px) saturate(160%);
 -webkit-backdrop-filter: blur(16px) saturate(160%);
 border: 1px solid var(--border);
 border-radius: var(--radius-lg);
 padding: 1.15rem 1.25rem;
 box-shadow: var(--shadow-sm);
}

.dashboard-shell {
 max-width: 1500px;
 margin: 0 auto;
 padding: 1.75rem clamp(1rem, 3vw, 2rem) 2.5rem;
}

.content-grid {
 display: grid;
 grid-template-columns: minmax(0, 2fr) minmax(300px, 420px);
 gap: 1rem;
}

.scroll-list {
 max-height: 420px;
 overflow-y: auto;
}

.brand {
 width: 44px;
 height: 44px;
 border-radius: 14px;
 background: var(--accent-gradient);
}

.icon-btn {
 width: 40px;
 height: 40px;
 border-radius: 999px;
}

.kpi-icon {
 width: 34px;
 height: 34px;
 border-radius: 10px;
}
```

Do not substitute approximate colors, generic gray panels, default browser controls, different breakpoints, different font families, or different dimensions. If a value is not explicitly repeated in this section, use the exact value from the corresponding visual-design table or component recipe above; do not invent a replacement.

### Layout

- Page content uses `.dashboard-shell`: `max-width: 1500px`, centered, padding `1.75rem clamp(1rem, 3vw, 2rem) 2.5rem`.
- Desktop content grid: `grid-template-columns: minmax(0, 2fr) minmax(300px, 420px)` with `1rem` gap.
- Desktop map is left; details and flight list are stacked in the right sidebar.
- At `max-width: 980px`, content grid becomes one column.
- At `max-width: 640px`, the header changes to a vertical layout and its actions stretch across the row.
- Filters use `grid-template-columns: repeat(4, minmax(0, 1fr))`; at `920px` use two columns; at `560px` use one column.
- KPI cards use the same four/two/one responsive grid behavior.
- Map shell minimum height: `460px`; map container minimum height: `460px`.
- Flight list is a `420px` maximum-height internal scroll area with `overflow-y: auto`.
- Surface panel padding: `1.15rem 1.25rem`; panel radius: `20px`.
- Repeated cards use `14px` radius, `1px` border, `1.05rem 1.15rem` padding, and a small shadow.
- Controls have a minimum height of `44px`; playback speed select is at least `4.2rem` wide.
- Keep icon sizes consistent: `14px` inline icons, `16px` button icons, `18px` control icons, `24px` brand/empty-state icons, and a `44px` brand mark.
- Use inline SVG icons. Do not replace them with emoji, arbitrary icon fonts, or text symbols.
- Every icon-only button must have an accessible `aria-label`; add a native `title` where the icon meaning is not obvious.

### Component-by-component visual recipe

#### Root footer

- Full-width panel-colored footer below the router outlet.
- Top border uses `--border`.
- Center content with wrapping on narrow screens.
- Font size `0.82rem`, muted text, accent-colored phone/email links.
- Inline phone and mail SVG icons are `14px`.

#### Header

- Flex row with brand on the left and live/theme controls on the right.
- Brand mark is `44px × 44px`, `14px` radius, accent gradient, white aircraft SVG, and accent shadow.
- Header status is a green translucent pill with a live dot and a JetBrains Mono clock.
- Theme control is a circular `40px × 40px` icon button.

#### Status strip

- A glass surface panel with a small blue aircraft SVG followed by the visible-flight count.
- Use `18px` icon size and semibold text.

#### KPI cards

- Four equal cards with `14px` radius and subtle shadow.
- Each card starts with a `34px × 34px` rounded icon badge.
- Icon badge background uses the status tone at approximately 12–18% opacity.
- Label is an eyebrow; value is approximately `clamp(1.8rem, 2vw, 2.6rem)` and weight 800.
- Tone colors: blue `--accent-strong`, green `--success`, amber `--amber`, red `--danger`.
- Hover raises the card by `3px` and uses `--shadow-md`.

#### Filters

- One glass surface panel with a header and a subtle “Clear all” pill button.
- Four equally sized fields with `0.8rem` grid gap.
- Labels sit above controls and use muted uppercase-ish small text.
- Callsign input has a `16px` search SVG inset at the left and `2.5rem` left padding.
- Inputs/selects use `44px` minimum height, `10px` radius, `--input-bg`, and accent focus ring.

#### Playback/layer controls

- One glass surface panel below filters, wrapping on smaller screens.
- Primary playback button uses the blue-violet accent gradient, white icon, and blue shadow.
- Speed select is compact, at least `4.2rem`, and displays `1x`, `2x`, or `4x`.
- Layer controls are pill labels with custom `15px × 15px` checkboxes.
- Checked pills use accent border, accent text, and a soft accent ring.
- Layer icons are `14px` SVGs for cluster, airport, and weather.

#### Live map

- A glass panel with a “Live map” heading and a tracked-count badge above the map.
- Leaflet map is framed by a `14px` radius and one border; do not add a second card around it.
- Aircraft pins are `16px` circles with a white border and shadow; selected pins scale to `1.35` and gain an accent ring.
- Airport pins are `11px` dark rounded squares with a white border.
- Aircraft icons transition for `0.55s linear` between animation ticks.

#### Flight details

- Glass panel with a profile header and status badge.
- Flight number uses JetBrains Mono, approximately `1.7rem`, weight 800.
- Route track displays origin and destination IATA codes, a `6px` progress bar, gradient fill, and a `16px` aircraft SVG positioned by percentage.
- Metadata is a two-column card grid, collapsing to one column below `700px`.


#### Flight list

- Glass panel with “Flights” heading and a blue count badge.
- Internal scroll list max height is `420px`.
- Each row is a full-width button with `14px` radius, `0.85rem 0.95rem` padding, subtle shadow, and hover lift.
- Rows show flight number, status badge, callsign, route with arrow SVG, and ETA with clock SVG.
- Selected row uses an accent border and a soft accent ring.

#### Status badge and empty state

- Status badge is a compact pill with a `6px` status dot, white text, uppercase label, and subtle shadow.
- Empty state uses a `52px` circular pale accent icon container with a `24px` aircraft SVG.
- Empty state heading uses primary text; supporting text uses muted text.

### Motion rules

- Use motion to communicate live state, not as decoration everywhere.
- Live dot pulses between a `4px` and `8px` soft ring.
- Buttons and cards lift only `1–3px` on hover.
- Aircraft markers transition linearly over `0.55s`.
- Route progress fill and plane transition over `0.5s`.
- Respect `prefers-reduced-motion: reduce` by disabling animation, transition, and smooth scrolling.
- Do not add parallax, bouncing, excessive particle effects, or auto-scrolling content.

## Accessibility Contract

- Keep semantic regions (`header`, `main`, `aside`, `section`, `footer`).
- Preserve labels for all inputs and selects.
- Preserve `aria-live` for changing flight counts and details.
- Preserve visible keyboard focus states.
- Preserve accessible names for icon-only controls.
- Do not communicate important state only through color.
- Keep contrast readable in both themes.

## Dependencies and Build Configuration

Do not remove or replace these required packages without an explicit request:

- Angular 22 packages
- `rxjs`
- `zone.js`
- `leaflet`
- `@types/leaflet`
- `leaflet.markercluster`
- `@types/leaflet.markercluster`
- `vitest`
- `jsdom`

Keep `angular.json` configured to:

- Include `zone.js` in `polyfills`.
- Copy `public/` assets.
- Copy `src/assets` to the `/assets` output path.
- Copy Leaflet images to the `/leaflet` output path.
- Include Leaflet and marker-cluster styles through `src/styles.scss`.

The first lines of `src/styles.scss` must be:

```scss
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.markercluster/dist/MarkerCluster.css';
@import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
```

The generated `FlightMapComponent` must point Leaflet's default icons to the copied image paths:

```ts
L.Icon.Default.mergeOptions({
 iconRetinaUrl: 'leaflet/marker-icon-2x.png',
 iconUrl: 'leaflet/marker-icon.png',
 shadowUrl: 'leaflet/marker-shadow.png',
});
```

Verify this configuration after generation:

```text
/assets/data/flights.json -> HTTP 200
/leaflet/marker-icon.png -> HTTP 200
/leaflet/marker-icon-2x.png -> HTTP 200
/leaflet/marker-shadow.png -> HTTP 200
```

If any of these paths return 404, fix `angular.json` before debugging the dashboard UI. The application intentionally handles a missing flight dataset by displaying an empty state, which can otherwise look like a filtering or rendering problem.

## Testing Contract

Maintain tests for:

- Flight status constants.
- `FlightDataService` success, validation, and error fallback.
- `FlightDashboardFacade` filtering, KPIs, airport collection, and selection.
- `FlightAnimationService` autoplay, pause/play, speed, interpolation, and stationary statuses.
- `ThemeService` persistence, toggling, and initial preference.
- Deterministic mock weather generation.

Use:

```bash
npm test -- --watch=false
```

Do not use legacy Karma flags such as `--browsers=ChromeHeadless`.

## Generation and Change Discipline

Before implementing a feature or making an edit:

1. Read the current generated file before changing it; user or formatter changes may be newer than this guide.
2. Preserve the public APIs and data shapes defined in this document.
3. Identify the smallest owning abstraction for the change.

After editing:

1. Run the narrowest relevant test or build check immediately.
2. Run `npm test -- --watch=false` for behavior or service changes.
3. Run `npx ng build --configuration development` before completion.
4. Do not refactor unrelated code or replace the visual system with a generic dashboard template.
5. Do not add a backend, authentication, external API, or new page unless explicitly requested.

When generating from an empty workspace, create the full application rather than only a plan. The minimum expected output is a runnable Angular project with `package.json`, `angular.json`, `src/main.ts`, `src/index.html`, `src/styles.scss`, the `src/app/` structure, `src/assets/data/flights.json`, and the test files described above.

## Definition of Done

A generated or modified version is complete only when:

- It preserves the dashboard workflow and all controls described above.
- It uses the same 20-flight Indian mock dataset behavior.
- The map remains stable during playback and manual zoom/pan.
- Filters update KPIs, map, details, and list together.
- Dark mode, playback, clustering, airport markers, weather, and scrollable list work.
- The premium typography, icons, tokens, spacing, shadows, and responsive layout remain consistent.
- `npm test -- --watch=false` passes.
- `npx ng build --configuration development` passes.
- No generated change introduces unnecessary inline styling, unrelated dependencies, or a different design language.