# Requirements: Cleanup and Testing

## Overview
This phase focuses on finalizing the modern UI theme update by removing unused legacy components and establishing a testing foundation for the application. This ensures code cleanliness and long-term maintainability.

## Functional Requirements
1.  **Code Cleanup**:
    -   Identify and remove unused React components (`EarthquakeList.tsx`, `EarthquakeStats.tsx`, `RecentLocalEarthquakes.tsx`).
    -   Verify no broken imports after deletion.
2.  **Testing Infrastructure**:
    -   Set up a testing environment using `Jest` and `React Testing Library`.
    -   Create a `test` script in `package.json`.
    -   Implement basic unit tests for core utility functions or components to verify the setup.
    -   Ensure `npm test` runs successfully.

## Non-Functional Requirements
-   **Maintainability**: Clean codebase without dead code.
-   **Reliability**: Automated tests to prevent regressions.
-   **Performance**: No impact on runtime performance (testing is dev-only).

## Tech Stack
-   **Testing Framework**: Jest
-   **Test Runner**: Jest
-   **React Testing**: React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
-   **Environment**: jsdom

## Constraints
-   Must use `npm` for package management.
-   Must not break existing build (`npm run build`).
