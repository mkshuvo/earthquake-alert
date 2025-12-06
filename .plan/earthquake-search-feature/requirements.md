# Earthquake Search Feature Requirements

## 1. Overview
Develop a comprehensive earthquake search feature that allows users to query historical and real-time earthquake data with advanced filtering, sorting, and visualization capabilities. The feature will be accessible via a dedicated search page (`/search`) and will provide both list and map views of the results.

## 2. Functional Requirements

### 2.1 Search & Filtering
- **Text Search**: Search by location name or place description.
- **Magnitude Range**: Filter by minimum and maximum magnitude.
- **Depth Range**: Filter by minimum and maximum depth (km).
- **Date Range**: Select start and end dates for the query.
- **Proximity Search**: (Optional/Future) "Near Me" or specific coordinates radius search.

### 2.2 Results Display
- **List View**: 
  - Display key details: Location, Magnitude, Depth, Date/Time, Alert Status.
  - Visual indicators for magnitude intensity.
- **Map View**: 
  - Interactive map displaying search results as markers.
  - Markers color-coded by magnitude.
  - Popup details on click.
- **Pagination**: 
  - Server-side pagination for performance with large datasets.
  - Page size control (10, 20, 50, 100).
- **Sorting**: 
  - Sort by: Date (Newest/Oldest), Magnitude (High/Low), Depth (Deep/Shallow).

### 2.3 User Experience
- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
- **Loading States**: Visual feedback during data fetching (skeletons or spinners).
- **Error Handling**: Clear messages for network errors or no results found.
- **URL Synchronization**: Sync search parameters with URL query strings for shareability.

## 3. Technical Requirements

### 3.1 Frontend (Next.js)
- **Route**: Create new page `src/app/search/page.tsx`.
- **State Management**: Use Zustand or URL search params for managing filter state.
- **Components**:
  - `SearchFilters`: Reusable filter form component.
  - `SearchResults`: Component to toggle between List/Map views.
  - `PaginationControl`: Reusable pagination component.

### 3.2 Backend (NestJS)
- **Endpoint**: Enhance `GET /earthquakes` or create `GET /earthquakes/search`.
- **Query Optimization**: 
  - Implement efficient MongoDB queries using `mongoose`.
  - Ensure indexes exist for: `magnitude`, `timestamp`, `depth`, `location.place`.
- **Pagination**: Return metadata (`total`, `page`, `limit`, `totalPages`).

### 3.3 Performance & Data
- **Caching**: Implement Redis caching for frequent search queries (e.g., default views).
- **Debouncing**: Debounce text input to reduce API calls.

## 4. Acceptance Criteria
- [ ] User can navigate to `/search`.
- [ ] User can filter by magnitude, date, and depth.
- [ ] Results update dynamically or on form submission.
- [ ] Pagination works correctly (next/prev/page selection).
- [ ] URL updates to reflect current filters.
- [ ] Map shows correct pins for the current result set.
- [ ] No console errors or performance lag.

## 5. Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Leaflet (Map), Lucide React (Icons).
- **Backend**: NestJS, Mongoose.
- **Database**: MongoDB (Data), Redis (Cache).
