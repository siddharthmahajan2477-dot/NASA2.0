# Level 1 — Apollo spacecraft inspection

## Architecture and scope

The existing welcome, briefing, preferences, sources and renderer test remain.
The briefing opens a lazy-loaded `ApolloInspection` screen. `SpacecraftViewer`
accepts a typed configuration for asset path, orientation, display scale,
camera direction, environment and scientific component records. Future missions
can supply another configuration; only Apollo content is implemented here.

No quests, XP, achievements, archive, timeline, souvenirs, backend or other
chapters have been implemented. Inspections do not claim to complete a mission.

## NASA asset provenance

- Original, unchanged file: `public/assets/models/spacecraft/Apollo Lunar Module.glb`.
- Source: https://science.nasa.gov/3d-resources/apollo-lunar-module/
- Credit confirmed on NASA's source page: NASA/Michael D. Carbajal.
- Usage guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/
- SHA-256: `379101dfcee399267addf771709107c35e826b0b9e5233272f123e4c8a585c4e`.
- 716,840 bytes; GLB 2.0; 134 glTF meshes, 157 primitives, 97,588 triangles,
  12 materials, 6 embedded images, 135 animation clips.
- Three.js creates 157 runtime Mesh objects from those primitives. This is not
  a discrepancy in the original mesh count.
- No supplied animation is played or assigned a historical interpretation.
- NASA's general Lunar Module visualization is not certified here as an exact
  Apollo 11 Eagle configuration. Both stages are shown during surface operations.
- NASA endorsement is explicitly disclaimed.

Draco decoder JS/WASM files are copied unmodified from the installed Three.js
`examples/jsm/libs/draco/gltf` folder. They are served from `assets/draco/` with
Apache 2.0 terms and an attribution notice. No decoder CDN is required. No new
dependencies were installed. Model materials and embedded textures are retained.

## Orientation, normalization and hotspot verification

The original model is already Y-up. The hatch/platform/ladder face +Z; no axis
rotation is applied. Measured accessor bounds are approximately:

- X: -3.214505 to 3.212890
- Y: 0.102631 to 5.115423
- Z: -3.215677 to 3.211063

The loader measures the decoded scene, scales its longest axis to 6.4 display
units, centers X/Z and grounds the minimum Y at zero. These are display units,
not a claim of physical meters. Camera framing fits the transformed bounding
box to the viewport's horizontal and vertical field of view.

Hotspots were added after inspecting rendered overview and component views.
These are spatial anchors, not semantic mesh selections. Generic names were
used only to cross-check measured geometry after visual identification.

| Component | Display anchor | Verification |
| --- | --- | --- |
| Ascent stage | 0.35, 3.60, 1.64 | Upper cabin, above stage boundary; forward cabin view |
| Descent stage | 1.15, 1.45, 1.17 | Gold-clad lower body, below cabin |
| Landing legs | 2.75, 0.45, 0.00 | Right-hand radial leg above its circular pad |
| Descent engine | 0.25, 0.52, 0.43 | Low-angle view confirms central bell beneath lower body |
| Ladder | -0.04, 1.08, 2.55 | Visible rungs on forward landing leg below egress platform |

Additional decoded geometry cross-checks: the visually identified central engine
geometry (`group13 pC`) spans approximately X/Z +/-0.4972 and Y 0.4071–1.1160
in original units; the ladder geometry (`polySurfa1`) spans X -0.2301–0.1437,
Y 0.5825–1.9470 and Z 2.1429–2.7961. Names alone did not establish identity.
The underbody engine marker is intentionally shown only when that component is
selected: it is usually occluded from above and can crowd the lower-stage marker
in narrow views. Selecting its list entry moves to a low view and reveals its
marker. Other occluded markers are hidden rather than drawn through the model.
Each component remains available in the keyboard/touch list.

## Scientific sources

Short component explanations are original prose based on these official records,
checked on November 14, 2026:

- Ascent cabin, separate engines and throttleable descent propulsion:
  https://www.nasa.gov/history/apollos-lunar-module-bridged-technological-leap-to-the-moon/
- Descent-stage role and remaining on the Moon:
  https://www.nasa.gov/wp-content/uploads/static/history/alsj/08_LM_&_SLA_Overview_pp61-68.pdf
- Landing gear stability and energy absorption:
  https://ntrs.nasa.gov/citations/19720018253
- Ladder and footpad gap, PDF page 6:
  https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-022-apollo-lunar-lander.pdf#page=6
- Apollo 11 sequence and rendezvous:
  https://www.nasa.gov/missions/apollo/apollo-11-mission-overview/

Terrain, rock placement and sunlight are illustrative, not surveyed landing-site
topography or a reconstruction of the exact Sun angle. The scene has no fog,
atmospheric scattering, clouds or wind. Low ambient fill preserves legibility;
it is an artistic lighting choice, not an atmosphere model.

## Controls, accessibility and performance

- Mouse orbit and wheel zoom; single-touch orbit and two-touch pinch zoom.
- Component focus, default-view reset, limited zoom/polar angles and no panning.
- Focus transitions respect reduced motion; pointer input cancels an active move.
  Camera clearance includes the offset of the selected target so orbiting an
  off-center leg cannot put the camera inside the opposite side of the model.
  Camera matrices update before DOM marker projection after immediate resets.
- Numbered markers and an equivalent keyboard-accessible component list.
- Collapsible component notes, visible focus, native buttons and source links.
- Viewport overflow is clipped; panels move below the scene on narrow screens.
- Demand rendering, DPR capped at 1.5, one shadow light, 1024px shadow map,
  procedural regolith texture and lightweight terrain/rocks; no post-processing.
- Model fetch is aborted on exit; completed decode workers, model geometry,
  materials and textures are released. A dedicated DOM portal isolates hotspot
  roots from the Canvas React root during navigation cleanup.

## Validation transport

Normal `npm run test:e2e` starts the existing Vite web server. This Codex host
denies loopback connections (Node EACCES and Chromium ERR_NETWORK_ACCESS_DENIED).
For that environment only, set `ECHOES_STATIC_TESTS=1` after building. The fixture
fulfills requests with the exact files in `dist`, including HTML, executable JS,
GLB, embedded model images and local Draco WASM. Real Chromium WebGL rendering,
camera input, pixel assertions, navigation and error paths still execute.
It is not a mock model or screenshot substitute. Direct HTTP delivery remains
a separate host-environment limitation, not a passing test claim.

The browser cache location may also require `PLAYWRIGHT_BROWSERS_PATH` in the
restricted host. Neither environment-specific absolute path is embedded in app
source or normal Playwright configuration.

The original ten foundation assertions remain. Inspection tests add real gold
spacecraft-pixel checks, loaded mesh count, local-only asset requests, camera
orbit/zoom/reset, touch gestures, all component panels, keyboard selection,
hotspot selection, responsive overflow, failed-load retry, unavailable WebGL and
context-loss behavior. No physical-device or hardware frame-rate claim is made.

## Final validation — November 14, 2026

| Check | Actual result |
| --- | --- |
| `npm run lint` | Passed, exit 0 |
| `npm exec -- tsc --noEmit --incremental false` | Passed, exit 0 |
| `npm run build` | Passed, exit 0; Vite generated `dist` |
| `npm run dev -- --port 4173 --strictPort` | Server started, Vite ready; stopped after validation |
| `npm run test:e2e -- --workers=2` | Final run: 30 passed in 2.2 minutes, exit 0 |

Playwright was run with `ECHOES_STATIC_TESTS=1` and
`PLAYWRIGHT_BROWSERS_PATH=C:/Users/Admin/AppData/Local/ms-playwright` in the
process environment. The normal direct-HTTP browser path was blocked by host
loopback permissions; it is not reported as passed. Production bytes were loaded
through the optional transport described above, with actual Chromium/SwiftShader
WebGL, embedded textures and local WASM decoding.

All original ten foundation tests passed. Twenty new inspection cases passed
across desktop 1440×900, mobile portrait 390×844, mobile landscape 844×390,
tablet 768×1024 and small mobile 320×568. Pointer/touch orbit, pinch/wheel zoom,
reset/focus, all five explanations, keyboard selection, real marker selection,
model retry, unavailable WebGL, context loss after a rendered frame and navigation
cleanup were exercised. Main interaction tests reported no fatal runtime or
console errors. Screenshots were reviewed for desktop, mobile and tablet layouts.

Corrections made during validation included isolating Html hotspot portals from
the Canvas DOM root, excluding only vendored decoder JS from application lint,
hiding the crowded underbody marker until focused, updating camera matrices
before DOM projection and waiting for a real frame before injecting context loss.
No assertion was deleted or skipped to conceal a failure.

Remaining limitations: no physical-phone/GPU performance measurements; generic
NASA Lunar Module fidelity rather than certified Eagle-specific detail; an
approximately 898 KB (243 KB gzip) lazy-loaded shared 3D bundle produces Vite's
size warning. No build error remains. Level 2 has not started.
