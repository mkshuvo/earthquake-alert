# Design: Cleanup and Testing

## Architecture
The testing architecture will follow standard Next.js + Jest patterns.

### Testing Stack
-   **Jest**: Core test runner and assertion library.
-   **React Testing Library**: For testing React components in a way that simulates user behavior.
-   **Jest Environment JSDOM**: To simulate a browser environment in Node.js.

### File Structure
```
src/
  __tests__/          # Directory for test files
    utils.test.ts     # Unit tests for utility functions
    components.test.tsx # Unit tests for components
  app/
    components/
      ...             # Existing components
```

## Cleanup Strategy
1.  **Delete Files**:
    -   `src/app/components/EarthquakeList.tsx`
    -   `src/app/components/EarthquakeStats.tsx`
    -   `src/app/components/RecentLocalEarthquakes.tsx`
2.  **Verification**:
    -   Run `npm run build` to ensure no static import errors.
    -   Grep codebase for deleted filenames to ensure no dynamic references.

## Test Configuration (`jest.config.js` or `jest.config.ts`)
We will use `next/jest` to automatically configure Jest for Next.js.

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

## Test Setup (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'
```

## CI/CD Integration
-   Add `npm test` to the build pipeline (simulated by manual run for now).
