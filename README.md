# Flight Operations Dashboard

A responsive Angular 22 flight tracking dashboard for aviation operations teams. It combines a Leaflet operations map, live mock-flight playback, synchronized KPIs, filters, route details, clustering, airport markers, weather overlays, and light/dark themes in a standalone-component architecture.

## Features

- Leaflet map centered on India with 20 validated domestic mock flights.
- Flight markers with flight number, callsign, route, and status popups.
- Selected-flight route visualization: origin, current position, destination, flown route, and remaining route.
- Flight details panel with aircraft, route, status, departure, arrival, and progress.
- KPI cards for total, active, delayed, and arrived flights.
- Reactive filters for callsign, status, origin, and destination.
- RxJS facade with filtered state, selected flight state, KPIs, and animation playback.
- Optional animation playback with 1x, 2x, and 4x speeds.
- Marker clustering, airport markers, deterministic weather overlays, and dark mode.
- Responsive desktop, tablet, and mobile layouts.
- Angular Material controls for playback speed and map-layer toggles.
- Unit tests for status constants, animation playback, and application behavior.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm 11+

## Setup

```bash
npm install
npm start
```

Open [http://localhost:4200/dashboard](http://localhost:4200/dashboard).

## Commands

```bash
npm start
npm run build
npm test -- --watch=false
```

Production output is written to `dist/flight-operations-dashboard-app/browser`.

## Deploy to Netlify

The repository includes `netlify.toml` with the Angular production build command, publish directory, and SPA route fallback. To publish:

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project** and authorize GitHub.
3. Select the repository. Netlify will read `netlify.toml`, build the Angular app, and publish it.
4. Open the generated Netlify URL and verify `/dashboard`, map tiles, data, and Leaflet markers.

The site uses OpenStreetMap tiles at runtime, so map tiles require an internet connection. No environment variables or API keys are required.

## Data and assets

The dashboard uses local mock data only; no backend, API key, or external flight service is required. The canonical dataset is stored at `src/assets/data/flights.json` and contains exactly 20 records.

Angular copies the following assets during the build:

- `src/assets` to `/assets`, including `/assets/data/flights.json`.
- Leaflet images to `/leaflet`, including `/leaflet/marker-icon.png` and `/leaflet/marker-shadow.png`.
- Public assets from `public` to the application root.

If the map markers or data do not appear after a configuration change, stop stale `ng serve`/Node processes and restart the development server so the asset copy step can run cleanly.

## Architecture

```text
src/app/
  core/
    constants/
    models/
    services/
  features/dashboard/
    components/
    pages/
    services/
  shared/components/
```

Smart state lives in `FlightDashboardFacade` and the core services. Presentational dashboard components use external `.html` and `.scss` files, typed inputs/outputs, and `OnPush` change detection. Leaflet owns map rendering inside `FlightMapComponent`; the facade owns filtering, selection, KPI derivation, and playback state.

## Design documentation

See [DESIGN.md](DESIGN.md) for the workflow, architecture, visual system, responsive strategy, accessibility choices, and trade-offs.

## Screenshots

- [Desktop overview, light mode](docs/screenshots/desktop-light.png)
- [Desktop overview, dark mode](docs/screenshots/desktop-dark.png)
- [Selected flight and route details](docs/screenshots/selected-flight.png)
- [Filtered flights](docs/screenshots/filtered-flights.png)
- [Map layers enabled](docs/screenshots/map-layers.png)
- [Responsive mobile layout](docs/screenshots/responsive-mobile.png)

## Coverage

| Requirement | Implementation |
| --- | --- |
| Angular 16+ | Angular 22 standalone application |
| TypeScript | Strict typed models and services |
| Reactive Forms | Debounced `FlightFiltersComponent` form |
| Routing | `/dashboard`, root redirect, wildcard fallback |
| Services and RxJS | Data, animation, theme services, and RxJS facade |
| Leaflet | Tiles, markers, popups, routes, layers, and clustering |
| Responsive UX | Desktop two-column layout with tablet/mobile reflow |
| Accessibility | Semantic regions, labels, live regions, keyboard focus, and pressed states |
| Optional features | Playback, dark mode, clustering, airports, weather, and tests |

## Repository

Repository: https://github.com/NikheelTalwade/flight-dashboard
