# Echoes of Exploration

**The missions ended. Their stories live on.**

An independent NASA Space Apps educational adventure about spacecraft equipment, engineering, and scientific legacy. The intended experience is a browser-based 3D historical investigation for young learners. This project is not affiliated with or endorsed by NASA.

## Current scope — Level 1

Welcome, Apollo 11 briefing, settings, scientific sources, and the original lazy-loaded renderer check remain. The briefing now opens an authentic NASA Lunar Module inspection on an illustrative lunar surface. Orbit, zoom, component focus/reset, five sourced component notes, keyboard selection, touch controls, loading/retry and graphics fallback are implemented. The same viewer accepts mission configuration data for future spacecraft.

Settings persist in localStorage when available. The sound setting remembers a preference only; no audio exists yet. No quest engine, mission progression, Chronosphere, archive, XP, achievements or mission save system is implemented.

## Stack

React 19, Vite, TypeScript, Tailwind CSS (Vite plugin), Three.js, React Three Fiber 9, Drei, Zustand. React 19 and Fiber 9 are paired intentionally. IndexedDB progress persistence is planned, not implemented.

## Local setup

Use Node.js 22.12 or later and npm. From this repository root:

```sh
npm install
npm run dev
```

The initial package ranges target compatible stable major lines; the first successful install generates the exact dependency lock. Once package-lock.json is reviewed and committed, use `npm ci` for repeatable installs.

## Validate and build

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

`build` runs the TypeScript compiler before Vite and writes `dist/`. Vercel static configuration: build command `npm run build`, output `dist`. No deployment is created by this repository's validation workflow.

## Structure

- `src/app`: application navigation and Zustand preference state.
- `src/components/ui`: application/renderer error boundary.
- `src/game/scenes`: configuration-driven spacecraft viewer, Apollo inspection content, and the original renderer test.
- `src/data`: source records.
- `src/storage`: validated local preference storage with failure handling.
- `src/styles`: Tailwind import and responsive design.
- `tests`: Playwright foundation and spacecraft inspection checks.
- `docs`: implementation and validation notes.

The supplied Apollo GLB is under `public/assets/models/spacecraft`; Draco support is under `public/assets/draco`. Future mission assets can use the same asset structure.

## Accessibility and responsiveness

Native buttons and checkboxes, visible keyboard focus, focus movement to screen headings, skip link, reduced-motion preference, safe-area padding, touch controls, and responsive layouts. Automated viewport coverage is configured for 1440×900, 390×844, 844×390, 768×1024, and 320×568 in Chromium. Level 1 production-browser checks passed across all five viewports; see `docs/level-1.md` for exact results and the restricted-host test transport. No physical-device verification is claimed. For restricted environments that deny loopback networking, `ECHOES_STATIC_TESTS=1 npm run test:e2e` (shell-specific environment syntax) tests the production files from `dist` through Playwright interception after `npm run build`. Normal local tests continue using the Vite server.

## Assets and sources

The landing silhouette is CSS illustration, not lunar photography or a precise terrain reconstruction. The renderer contains procedural test geometry. Scientific sources are linked in the application; the inspection uses the existing unchanged NASA/Michael D. Carbajal Lunar Module GLB. Its embedded materials are retained; Draco decoding uses local JS/WASM files under `public/assets/draco` with license and attribution notices. The inspection exposes engineering sources and reconstruction limitations.

## Next milestone

Level 2: a deterministic reusable quest engine and the first Apollo investigation. Level 1 implementation notes, source provenance, hotspot verification and validation limitations are in [docs/level-1.md](docs/level-1.md).
