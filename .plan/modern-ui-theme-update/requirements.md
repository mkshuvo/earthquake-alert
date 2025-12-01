# Modern UI Theme Update Requirements

## 1. Feature Overview
Refresh the Earthquake Alert application with a modern, cohesive dark theme. The goal is to improve visual hierarchy, readability, and overall user experience while maintaining existing functionality.

## 2. Functional Requirements
- **Visual Consistency:** Apply a unified color palette (Slate) across all components.
- **Dark Mode:** Ensure the application is optimized for dark mode environments (Slate 950 background).
- **Responsive Design:** Maintain or improve mobile responsiveness.
- **Iconography:** Replace ad-hoc SVG icons with `lucide-react` for consistency.
- **Map Integration:** Style the Leaflet map to match the dark theme (CartoDB Dark Matter tiles).

## 3. Non-Functional Requirements
- **Performance:** Ensure no regression in load times or runtime performance.
- **Accessibility:** Maintain contrast ratios for text and interactive elements.
- **Maintainability:** Use utility classes (Tailwind CSS) and shared components/hooks.

## 4. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** lucide-react
- **Utilities:** clsx (for conditional class names)
- **Maps:** React Leaflet / Leaflet (native)

## 5. Integration Points
- **Store:** `earthquakeStore.ts` (Zustand) - updated to support new UI requirements (e.g., `maxMagnitude`).
- **Services:** `apiService.ts`, `realtimeService.ts` - no changes to core logic required, only UI consumption.
