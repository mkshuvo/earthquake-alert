# Modern UI Theme Update Design

## 1. Design Philosophy
- **Palette:** Slate (Blue-grey) for neutral tones, with semantic colors for alerts:
  - Background: `bg-slate-950`
  - Cards/Panels: `bg-slate-800/50` with `backdrop-blur-sm`
  - Borders: `border-slate-700`
  - Text: `text-slate-200` (primary), `text-slate-400` (secondary)
- **Semantic Colors:**
  - Success/Low Magnitude: `emerald-400` / `emerald-500`
  - Warning/Medium Magnitude: `amber-400` / `yellow-500`
  - Danger/High Magnitude: `orange-500`
  - Critical/Extreme Magnitude: `red-500`
- **Typography:** Sans-serif (Inter/System UI).
- **Effects:** Glassmorphism (backdrop blur), subtle gradients for emphasis.

## 2. Component Updates

### 2.1. Layout
- **Global CSS:** Set default body background to `bg-slate-950`.
- **Header:** Sticky positioning, glass effect, improved navigation links.

### 2.2. Dashboard Components
- **EarthquakeStats:**
  - Cards with icon, title, value.
  - Use semantic colors for "Max Magnitude" and "Significant".
- **FilterPanel:**
  - Collapsible section.
  - Styled inputs (dark mode friendly).
- **EarthquakeMap:**
  - Use `CartoDB Dark Matter` tiles.
  - Custom circular markers with ripple effects for magnitude.
  - Popups styled with Tailwind classes.
- **RecentLocalEarthquakes & EarthquakeList:**
  - Table/List layout with hover effects.
  - Magnitude badges.
- **LatestNearMeBanner:**
  - Hero section for nearest earthquake.
  - Dynamic background gradient.

### 2.3. Icons
- Replace all custom SVGs with `lucide-react` imports (e.g., `Activity`, `Map`, `List`, `Wifi`, `Clock`).

## 3. Data Flow
- No changes to data fetching or WebSocket architecture.
- UI components subscribe to `useEarthquakeStore` as before.

## 4. Dependencies
- `lucide-react`: For icons.
- `clsx`: For cleaner class conditionals.
