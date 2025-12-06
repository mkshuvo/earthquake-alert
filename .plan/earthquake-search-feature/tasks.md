# Tasks

[x] TASK-001: Backend - API & Service Implementation
    [x] Update `EarthquakeQueryDto` in `dto/earthquake.dto.ts` with new search params (q, minDepth, maxDepth, page, sortBy, order)
    [x] Implement `search()` method in `EarthquakeService` with MongoDB aggregation/filtering
    [x] Implement Redis caching strategy for search queries
    [x] Add `GET /earthquakes/search` endpoint in `EarthquakeController`
    [x] Write unit tests for `EarthquakeService.search()`

[x] TASK-002: Backend - Database Indexing
    [x] Create script or migration to add MongoDB indexes:
        - `properties.place`: "text"
        - `properties.mag`: 1
        - `properties.time`: -1
        - `geometry.coordinates.2`: 1 (depth)

[x] TASK-003: Frontend - API Integration
    [x] Update `apiService.ts` to include `searchEarthquakes(params)` method
    [x] Define TypeScript interfaces for Search Request/Response

[x] TASK-004: Frontend - Components Development
    [x] Create `src/app/search/page.tsx` skeleton
    [x] Create `SearchFilters` component (Text input, Range sliders, Date pickers)
    [x] Create `SearchResults` component (List view with `EarthquakeCard`)
    [x] Create `SearchMap` component (Reusing/Extending `EarthquakeMap`)
    [x] Create `Pagination` component

[x] TASK-005: Frontend - State & Logic
    [x] Implement `useEarthquakeSearch` hook (or update Store) to manage URL params <-> API sync
    [x] Implement debounced search for text input
    [x] Integrate components into `src/app/search/page.tsx`

[x] TASK-006: Testing & Verification
    [x] Backend Integration Test: Verify `/search` returns correct filtered data
    [x] Frontend Test: Verify URL updates when filters change
    [x] Frontend Test: Verify Pagination works
    [ ] Manual Verification: Check Map pins update with search results
