# Tasks

[x] TASK-001: Project Setup & Dependencies
    [x] Install `lucide-react`
    [x] Install `clsx`
    [x] Verify Tailwind configuration

[x] TASK-002: Global Styles & Layout
    [x] Update `globals.css` with Slate-950 background
    [x] Update `page.tsx` layout structure
    [x] Refactor Header/Navigation
    [x] Implement `ParallaxBackground` and hooks

[x] TASK-003: Dashboard Components Refactor
    [x] Refactor `EarthquakeStats.tsx` -> `StatCard.tsx`
    [x] Refactor `FilterPanel.tsx`
    [x] Refactor `ConnectionStatus.tsx`
    [x] Refactor `LatestNearMeBanner.tsx` (integrated into main flow)

[x] TASK-004: Data Visualization Refactor
    [x] Refactor `EarthquakeMap.tsx` (Leaflet dark mode)
    [x] Refactor `RecentLocalEarthquakes.tsx` -> `EarthquakeCard.tsx` grid
    [x] Refactor `EarthquakeList.tsx` -> `EarthquakeCard.tsx` list
    [x] Create `EarthquakeDetails.tsx` modal
    [x] Update `src/app/earthquakes/page.tsx` to use new components
    [x] Clean up unused components (`DateFilter`, `LocationFilter`, etc.)

[x] TASK-005: Verification
    [x] Run `npm run build` to ensure type safety
    [x] Verify visual consistency across components
