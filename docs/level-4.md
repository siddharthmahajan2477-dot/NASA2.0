# Level 4 - NEAR Shoemaker completion report

Status: COMPLETE. Final required checks passed on November 14, 2026.

## Survived and recovered
Original NEAR GLB and Eros STL retained unchanged. No new app, dependencies or downloads.
Six quests, 11 evidence records, 10 timeline events, references, mission routes and separate
near-shoemaker save key are present. Existing engine/storage version is unchanged.
After reconnect the descent slider edit was absent; it is now restored. It moves a teaching
point toward a raycast intersection on the actual mesh. This is NOT a registered landing site.

## Asset verification
NEAR Shoemaker.glb: 701808 bytes, GLB 2, four meshes/primitives/materials, six embedded
images (three runtime textures), 9312 triangles, required Draco, zero animations.
Actual raw bounds approx 5.29358 x 2.86457 x 5.29358. Existing viewer normalization/grounding
is reused; display span 6.4 is arbitrary, not metres. NASA model attribution.
Asteroid 433 Eros.stl: 10042884 bytes, valid binary STL, 200856 triangles. Original full
geometry retained, centered and uniformly scaled. No photo texture in STL; neutral material
is illustrative. No named geological feature is pinned onto unregistered geometry.

## Scientific basis
Official NASA mission overview, asset pages, NASA landing-site mosaic, NASA surface science
announcement, JHUAPL mission page and PDS radio science archive were opened and reviewed.
Historical dates are separate from schematic path geometry. Orbital distances of 50 and
35 km are centre distances. Launch 1996-02-17, Mathilde 1997-06-27, Earth 1998-01-23,
first Eros flyby 1998-12-23, orbit insertion 2000-02-14, landing 2001-02-12,
surface extension announced 2001-02-14, last contact 2001-02-28.
NASA sources differ on historical touchdown time; no exact hour is used here.
The PDS radio archive contains range/Doppler observations, not an already converted track
used by this game. No sampled trajectory or geographic axis registration is claimed.
The official planned-site mosaic (NASA/JPL/JHUAPL) is linked, with its south-up orientation
explained. Region south of Himeros is described without a fabricated mesh pin.

## Inspection
Rendered GLB visually inspected in docs/near-overview.png. Visible solar arrays, central
body and top high-gain dish are the three configured regions. Generic material-node names
were not accepted as component identities. Hidden instrument apertures are records only.
Focus, keyboard selection and actual marker click/tap passed across all five viewports. Dish and body labels use leader offsets to avoid self-occlusion while camera focus stays on the component anchors.

## Quests
1. Chasing a Moving Rock: route sequence, navigation reasoning; solar and journey inspection.
2. A World Without a World's Shape: real Eros observation, shape/measurement relationships.
3. Holding Orbit Around Eros: orbital phase inspection, distance and tracking reasoning.
4. Reading the Asteroid: body inspection and six-instrument measurement matching.
5. The Landing Nobody Designed For: deliberate descent sequence and risk/evidence classification.
6. The Signal That Continued: surface sequence, antenna inspection, orbital/surface measurement
classification and a final supported conclusion. No sample return or accidental crash story.
All use existing shared engine, validated requirements, hints, retries, ordered unlocks and saves.

## Files
New: src/data/nearRecords.ts; src/game/quests/near.ts and nearStore.ts;
src/game/scenes/nearConfig.ts, NearBriefing.tsx, NearInspection.tsx, NearJourney.tsx,
SmallBodyViewer.tsx; tests/near.spec.ts, near-engine.spec.ts; docs/inspect-near.mjs,
inspect-near-browser.mjs, near-overview.png, near-debug.png, level-4.md.
Modified: src/app/App.tsx, src/app/store.ts (routes, cards, mission identity);
src/game/scenes/SpacecraftViewer.tsx (mission-aware loading label only).
Engine logic and storage schema remain unchanged. One old assertion in tests/ingenuity.spec.ts expected no NEAR launch button; it now verifies opening the completed NEAR briefing and returning to mission selection. All original tests remain and rendering/interaction assertions were preserved.

## Earlier validation checkpoints
Earlier pre-disconnect lint and TypeScript passed, but final source requires rechecking.
First desktop test run: 2 passed / 2 failed (test-helper matching bug).
Corrected helper also tried to recollect already discovered evidence in a later quest;
trace diagnosed this and helper now respects collected state. That diagnostic run was
interrupted, not a pass. Current desktop run contains seven scenarios.
Those checks were pending at this earlier checkpoint; final successful results are recorded below.

## Scope and limitations
No exact historical trajectories, landing-site mesh registration or physical scale claims.
No instrument hotspots without geometric verification. No historical terrain texture.
No Level 5, archive, audio, achievements, backend, deployment or GitHub access.

## Final validation and diagnostics

The final source passed:
- npm run lint: exit 0, max-warnings 0.
- npm exec -- tsc --noEmit --incremental false: exit 0.
- npm run build: 624 modules, Vite 7.13 seconds, exit 0.
- npm run test:e2e -- --workers=2: 139 passed in 24.3 minutes, exit 0.

HTML report metadata: 139 total / 139 expected / 0 unexpected / 0 flaky / 0 skipped.
.last-run.json: passed, failedTests empty. Includes all 101 previous tests plus 38 NEAR
cases (35 browser scenarios across five viewports, three engine/data/asset checks).
The NEAR-only browser run also completed 35/35 in 6.4 minutes. The final run used
normal Vite HTTP, Chromium/SwiftShader, two workers and no CI retries. No transparent
production-file transport was needed. Production compilation passed; the full browser
suite used the development HTTP server rather than a deployed production host.

Diagnostic failures are not final failures: matching helper initially selected row zero
for every instrument; evidence helper then tried to recollect a record shared between
quests; the warning assertion matched header and finale paragraphs. Each test helper
was corrected to model the intended interaction without changing game answers or
loosening assertions. The dish label was truly self-occluded, so its geometric leader
offset was corrected. A focused run emitted seven passes but hung during server teardown;
it was interrupted, not counted as a clean process result. A separate Vite server avoided
that lifecycle issue in the clean 35/35 and 139/139 runs. One broad diagnostic run caught
the obsolete no-NEAR-button assertion; its replacement tests the new route and return.
No old pixel threshold, timeout, scientific assertion or prerequisite was weakened.

## Actual controls and journey

Mouse orbit/wheel zoom, touch drag/pinch, component focus and camera resets are retained.
Eros has explicit camera-position assertions for drag, zoom and reset, with touch events
on touch profiles. All component markers are actually clicked or tapped. Journey buttons,
record observations and approach slider are keyboard-operable. Reset and phase changes
are immediate; no automatic animation violates reduced-motion preferences. Error and
WebGL fallbacks leave scientific text, journey milestones and quest prerequisites usable.
The shape's phase selection changes the 3D loop or descent line while preserving the
loaded geometry. Its point moves to an actual mesh intersection, explicitly a teaching
location. No asteroid coordinates, real north axis or exact historical trajectory are implied.
Mission dates cover launch, Mathilde, Earth assist, initial Eros flyby, insertion, changing
orbital distances, descent/touchdown, surface science and last contact.

## Integration and performance

All three mission cards are available: five Apollo quests, six Ingenuity quests and six
NEAR quests (17 total). Existing shared quest engine, presentation, GLB viewer and save
factory are reused. NEAR uses its own near-shoemaker IndexedDB mission key in the existing
version-1 database; cross-mission/future save rejection, ordered restoration and restart
are tested. Full NEAR browser playthroughs include refresh/reentry and independent restart;
the complete storage-disabled mission passes. Reference reading remains separate from
quest evidence collection. Scientific prose is independent of scene geometry and suitable
for future reference/narration reuse. No archive or audio system is implied.

No model reload occurs on quest transitions: browser tests assert a single NEAR GLB
request. STL fetching is StrictMode guarded, abortable and released on unmount. Both
viewers render on demand. Original Eros resolution is retained; there is no derived asset
requiring provenance. The original STL is about 10 MB; physical device memory/FPS were
not measured. Existing shared 3D chunk warning remains (898.46 kB minified / 242.64 kB gzip).
The npm environment prints an http-proxy deprecation warning, which did not block checks.

## NASA judging alignment

Impact: approachable investigations and accessible fallback science, without claiming
measured learning outcomes. Creativity: a route-to-orbit-to-surface story earned through
17 total mission quests. Validity: authentic assets, primary references, deliberate-descent
wording, and visible geographic/trajectory limits. Relevance: mission measurements and
engineering drive player decisions. Presentation: integrated real 3D, readable records,
responsive controls and verified progression; premium polish remains outside this level.

Final status: COMPLETE for Level 4. No known failing regression remains. Exact geographic
mesh registration, physically accurate trajectories and physical-phone performance remain
explicit limitations, not fabricated features. No Level 5 or deployment was started.
