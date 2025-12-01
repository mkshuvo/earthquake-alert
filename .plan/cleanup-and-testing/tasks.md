# Tasks: Cleanup and Testing

[x] TASK-001: Clean Up Legacy Components
    [x] Delete `src/app/components/EarthquakeList.tsx`
    [x] Delete `src/app/components/EarthquakeStats.tsx`
    [x] Delete `src/app/components/RecentLocalEarthquakes.tsx`
    [x] Verify build passes (`npm run build`)

[x] TASK-002: Install Testing Dependencies
    [x] Install `jest`
    [x] Install `jest-environment-jsdom`
    [x] Install `@testing-library/react`
    [x] Install `@testing-library/jest-dom`
    [x] Install `@testing-library/user-event`
    [x] Install `ts-node` (optional, for TS config if needed)

[x] TASK-003: Configure Jest
    [x] Create `jest.config.js`
    [x] Create `jest.setup.js`
    [x] Add `"test": "jest"` script to `package.json`
    [x] Add `"test:watch": "jest --watch"` script to `package.json`

[x] TASK-004: Create Initial Tests
    [x] Create `src/__tests__/sanity.test.ts` (Simple 1+1=2 test)
    [x] Create `src/__tests__/components/StatCard.test.tsx` (Render test)

[x] TASK-005: Final Verification
    [x] Run `npm test` and ensure all tests pass
    [x] Run `npm run build` to ensure production build is safe
