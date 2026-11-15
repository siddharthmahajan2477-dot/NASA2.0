# Level 6 — current implementation and recovery checkpoint
Status: final validation pending. Do not claim completion yet.

## Preserved systems
All original mission configs, 17 quests, evidence, archive data, reward calculation and IndexedDB
schema remain. No original model was replaced, renamed or downloaded again. No dependencies,
backend, accounts, paid voice APIs, publishing or Level 7 were introduced.

## Saved implementation
- Global corner original tagline and OBSERVE. READ. SOLVE.; homepage learning motto.
- Dark presentation CSS for cards, frames, typography/spacing, controls and responsive branding.
- JourneyFrame in the EXISTING Universe journey page: curved schematic chronology, original
  rocket/helicopter SVG marker, clickable nodes, previous/next, sourced milestone information,
  desktop note/Continue Anyway on compact screens, optional narration. No actual models fly.
- JourneyObjects: optional static GLB composition, using actual Earth/Moon/Mars/Saturn V/
  Columbia/Eagle/Perseverance/Ingenuity/NEAR/Delta II assets. Individually normalized, not a
  historical configuration or physical scale. No asset animation clips are played. Local Draco.
  Opt-in prevents multi-megabyte display assets loading on every page/mobile startup.
- Existing Moon/Mars/Eros controls retained. NearJourney synchronizes external selected events
  without reloading the Eros mesh. Geographic/trajectory limitations remain explicit.
- Mathilde raw shape collection not converted/registered: honest milestone fallback. Generic
  Delta II display is not claimed as a verified exact mission configuration. No wrong Atlas
  model is used for Mars 2020; Atlas V 541 is explained in text.
- Three MissionFilm routes and null-src configuration: NO actual MP4 files exist. Clear missing
  film state with immediate Skip/Continue. Native controls/replay for supplied approved files;
  object-fit contain, no fake resolution/upscaling. Original quick Apollo Start Exploration and
  direct mission/resume routes remain. Mission selection goes through film screens; existing
  tests now explicitly Skip before their original briefing/inspection assertions.
- Homepage optional generic astronaut guide uses actual astronauts/Astronaut.glb, shared viewer
  and local Draco. Real rendered orientation/regions checked. Helmet, torso, gloves and boots
  have educational selectors/focus. No named astronaut identity or speculative internal marker.
  NASA spacesuit source opened; life support explained without hidden-system hotspots.
- ListenMode: optional browser speech, explicit play/replay, pause/resume, stop, rate, volume,
  global mute respect and Unmute control, unsupported text-first fallback, owned-voice cleanup.
  Original text remains readable. No word-level sync or recorded voice claims. Used in films,
  briefs, quest openings, separate evidence-narration area, archive chapters/records and journey
  cards. Evidence controls remain separate from scientific answer controls.

## Asset audit and visual checks
Metadata: docs/level-6-assets.json. Astronaut 762988 bytes, 6381 triangles, 2 runtime meshes,
2 materials/textures, Draco, no clips. Helmet 232496 bytes, Draco, one unused clip.
Apollo static composition rendered actual Earth, Saturn V, Columbia, Eagle and Moon.
Images: docs/astronaut-overview.png, astronaut-helmet.png, astronaut-spacesuit.png,
astronaut-gloves.png, astronaut-boots.png, apollo-display-objects.png.
Scripts: docs/inspect-astronaut.mjs and inspect-astronaut-browser.mjs.
A visual check found vertically wrapping labels and React DOM cleanup errors in 3D Html
loading/caption overlays. Labels/loading status moved outside the new display canvas and
outside the globe Suspense fallback; cold-load/navigation script then reported no page errors.

## Actual validation so far
- New Level 6 browser scenarios: 25/25 passed, five viewports, two workers (45.7 seconds).
- Combined new desktop plus Level 5 browser scenarios: 14/14 passed before final display fixes.
- Lint/TypeScript/build passed before the latest small narration/marker edits; rerun final.
- A full 212-test diagnostic run was interrupted after trace diagnosis: old NEAR helper selected
  hidden narration-rate dropdowns along with science answers. Scoped helper to .reasoning-board
  select, retaining every original scientific/progression/rendering assertion. Focused seven-case
  NEAR desktop run currently pending. No timeout or pixel threshold was relaxed.
- Full final npm run test:e2e -- --workers=2 (212 tests) remains required.

## Files
New: src/components/ListenMode.tsx, MissionFilm.tsx, JourneyFrame.tsx;
src/data/missionFilms.ts; src/game/scenes/AstronautGuide.tsx, JourneyObjects.tsx;
tests/premium.spec.ts; docs/level-6-assets.json, level-6.md and inspection scripts/images.
Modified: src/app/App.tsx, store.ts; src/components/Universe.tsx; src/game/quests/MissionQuest.tsx;
src/game/scenes/NearJourney.tsx, PlanetJourney.tsx, NearBriefing.tsx, IngenuityBriefing.tsx;
src/styles/index.css. Existing test helpers/specs with Explore mission clicks now Skip films;
tests/near.spec.ts matches only science dropdowns. No tests deleted/skipped.

## Remaining acceptance work
Finish focused and complete regressions, required final checks, inspect remaining display
asset orientations/mobile usability, and report exact results. Approved films still need actual
licensed files/configuration for video playback; missing-film introductions work by design.
Browser voice behaviour varies, and no physical-device FPS certification is made. Existing
shared 3D chunk-size warning remains. Do not describe an interrupted run as a pass.

## Latest checkpoint
Film-first mission selection, film return links, Apollo briefing narration and all archive/evidence
narration integrations are now saved. Astronaut four visible region focus images inspected.
Journey marker now uses original rocket/helicopter SVG outlines on the schematic curve.
New premium.spec.ts: 25/25 passed across all five profiles (45.7 s). Existing Level 5 desktop
checks plus new Level 6 desktop checks: 14/14 passed (49.4 s). Latest lint/tsc/build passed
before the small final narrative/marker edits; rerun final commands after diagnostics.

Full 212-test run interrupted to diagnose NEAR helper selecting hidden voice-rate dropdowns.
Scoped tests/near.spec.ts to .reasoning-board select; scientific assertions retained. A focused
NEAR desktop run then produced 5 passes / 2 failures: full mission assumed Eros STL ready
within five seconds after the independent spacecraft GLB; now waits for Eros real WebGL
canvas with the existing Eros readiness budget before unchanged triangle metadata assertion.
Model-error retry case hit its existing total 30-second budget during rendering. No deadline
was increased. One-worker comparison is currently running. Full final two-worker suite pending.

Clean manual direct-HTTP script now verifies astronaut selection/closing and Apollo static
model composition without page errors. 3D Html caption/loading portals were the DOM cleanup
error source and are removed from the new display and the globe loading fallback.
Do not present any diagnostic/incomplete run as a clean regression pass.

## Validation checkpoint — latest
Final candidate lint, TypeScript and build passed. First full development-HTTP run: 209 passed / 3 failed (35.8m). Corrected asynchronous test readiness: Eros retry now awaits its real renderer before the unchanged triangle assertion; globe fallback awaits the lazy component before its unchanged alert assertion. Targeted cases: 10/10 passed across five viewports. Second full development-HTTP run: 210 passed / 2 failed (21.5m), small-phone save failure and NEAR briefing module preparation. Vite logs proved generated Playwright report HTML triggered full-page reloads during runs; trace recorded unresolved dependency requests. vite.config.ts now excludes playwright-report and test-results from its watcher. IndexedDB watchdog now stops once the database opens, leaving commit/abort handling to transaction events instead of falsely timing out a live transaction. No schema, IDs, awards or migration changes.
Final candidate rebuilt successfully. Next run uses the actual production build over normal HTTP on 127.0.0.1:4173 (npm run preview), not file interception. Full regression pending; do not claim completion until its result is saved.

## FINAL VALIDATION — supersedes pending checkpoints above
- npm run lint: PASS, exit 0.
- npm exec -- tsc --noEmit --incremental false: PASS, exit 0.
- npm run build: PASS, exit 0; 638 modules; shared 3D chunk warning remains (900.43 kB, 243.38 kB gzip).
- npm run test:e2e -- --workers=2: PASS, 212 passed / 0 failed / 0 skipped, 25.3 minutes.
- Actual production build served with npm run preview -- --host 127.0.0.1 --port 4173 --strictPort. Normal HTTP, no production-file interception, actual Chromium WebGL with software rendering. Five viewport profiles and all 17 mission quests retained. 190 browser cases plus 22 engine cases; 25 new Level 6 cases.
- The two earlier incomplete development-server results are diagnostic history, not claimed passes. Their loading readiness and report-watch issues are documented above.

Additional modified files: src/storage/journey.ts (stop database-open watchdog before transaction lifecycle), vite.config.ts (ignore generated Playwright report/results in dev watcher), tests/universe.spec.ts (wait for lazy globe region before unchanged fallback assertion). No schema change or progress erasure.

Release limitations: no approved MP4 assets supplied. All three film introductions and immediate Skip/Continue paths work; actual full-length film playback cannot be validated without files. Configured local files use native video controls and preserve original resolution. Browser speech voices/pause behaviour vary; no word-synchronized subtitles or generated recordings. Existing large shared 3D chunk remains, optional multi-model displays load only on request. Mathilde raw shape data is not rendered as invented geometry; geographic/trajectory caveats remain. No physical-device frame-rate certification.

Level 6 software integration validated; final media readiness is CONDITIONAL on approved film assets. No deployment or Level 7 work performed.
