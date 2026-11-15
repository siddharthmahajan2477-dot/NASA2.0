# Level 2 regression fixes — November 14, 2026

## Evidence from the original Windows CMD run

The reported run contained 59 tests: 48 passed, 11 failed. All eleven failed
traces and their error contexts were inspected before making source changes.
Trace screencast frames were extracted and visually inspected for the missing
header and pixel failures. Network and console records were checked as well.

### Duplicate model requests

Every full playthrough recorded two GLB requests at the initial inspection mount,
not at a quest transition: an aborted request (response status -1) immediately
followed by a 200 response. The desktop pair started about 0.4 milliseconds apart.
`src/main.tsx` enables StrictMode, and the loader effect started fetch immediately
before its development replay cleanup called AbortController.abort(). The second
setup then fetched again. There was no preload call or quest-specific model path.
The test correctly counted both request events; its expected count stays one.

The loader now yields one microtask and checks that its setup is still active
before beginning I/O. StrictMode's discarded synchronous setup never fetches.
Real unmounts still abort requests, release owned resources and dispose decoders.
No persistent global model cache or alternative spacecraft loader was added.

### Missing quest header and model-error alert

The affected snapshots showed App's "Opening the lunar surface…" fallback, not
a storage exception or broken quest engine. There were no recorded page errors.
The tests used App's back button as a readiness signal even though that control
appears before the lazy inspection module. The missing-header assertions expired
while the module and initial graphics work were still starting. A late trace
frame already showed the real header, confirming that it did eventually mount.

The failed-model trace contains the deliberately intercepted 503 response. It
arrived near the assertion deadline while the outer fallback still covered the
inspection. The handler was not accidentally returning a successful model.

Changes:

- A local Suspense boundary around Canvas isolates asynchronous renderer startup
  from the quest header, component notes and model/error UI.
- The shared test entry waits for the actual inspection module and header before
  making state-specific assertions. Its explicit module wait uses the existing
  30-second asset/startup budget; the alert/header assertions themselves retain
  their normal deadline. This is phase synchronization, not a blanket timeout rise.
- The error test explicitly awaits the 503 response, then verifies error, notes,
  retry and actual spacecraft rendering after recovery.

Broader regression runs exposed the same lazy-module synchronization gap in two
other entry paths: the corrupted-checkpoint test navigated manually instead of
using the shared entry helper, and the foundation test checked for a canvas while
the briefing still showed "Loading renderer test." Both now wait for their actual
module before state-specific assertions. The foundation also waits for Three's
renderer stamp before accessing its context. Its original center-versus-background
pixel assertion remains unchanged. An earlier full run
also exhausted its 30-second total deadline at a settings reload; that case passed
alone in 2.8 seconds. These diagnostic failures are not counted as clean runs.

The foundation tour and model-error/retry flow now have a 90-second whole-test
budget, matching the existing inspection-controls flow. Diagnostic runs exhausted
their old 30-second total deadline during navigation/reload, rather than failing
an engineering or rendering assertion. The retry test now includes two loading
attempts and actual post-retry pixel verification. This changes only those two
whole-flow budgets: individual assertions, the 30-second model deadline and the
20-second gold-pixel deadline retain their limits. Other test deadlines remain.

### Gold-pixel timeouts

The failed narrow-screen trace frames showed the top of the page: the new Level 2
entry/header had pushed the spacecraft below the viewport. The old tests polled
the drawing buffer before scrolling to the spacecraft. Parsed model state and an
existing canvas did not establish a delivered, visible frame. An isolated
one-worker production run of the original small-phone inspection passed, so the
traces did not establish permanently broken geometry, materials or WebGL.

Grouped checks exposed a second, more important race. A failing small-phone frame
visibly contained the gold spacecraft, although raw readback found none. Added
diagnostics then caught it in a production tablet retry test: a live 448x450
default framebuffer, GL error 0, gold count 0, **preserveDrawingBuffer=false**.
This contradicted the viewer's explicit true setting. The test was calling
getContext('webgl2') as soon as a DOM canvas appeared, before R3F initialized its
WebGLRenderer. That call can CREATE the context with browser defaults. The later
renderer must reuse those immutable attributes, and demand-rendered buffers are
then discarded after presentation even though the compositor still shows Eagle.

The helper now waits for Three's `data-engine` stamp before it can call getContext.
Three sets that stamp in the same synchronous constructor as context creation;
the next browser task runs after the constructor. The test also requires preserved
drawing buffers and GL error 0, in addition to the original gold pixels. It
scrolls the enclosing graphics area and rechecks canvas scrolling during polling
so that asynchronous resizing cannot undo the initial visibility setup.

`tests/rendering.ts` verifies visibility and polls its real WebGL2 buffer.
The RGB rule and threshold (>80 gold pixels)
are unchanged. It additionally reports context state, buffer dimensions and gold
count, context attributes and GL errors for diagnosis. Context-loss tests still require those pixels before losing
the context. No screenshot substitute, hidden error, skipped assertion, larger
pixel timeout, GPU flag change or reduced worker count is used to obtain a pass.

## Files

- `src/game/scenes/SpacecraftViewer.tsx`: StrictMode-safe fetch start and local
  graphics Suspense boundary.
- `tests/rendering.ts`: shared inspection/frame readiness with actual pixel checks.
- `tests/apollo-quests.spec.ts`: use readiness helper; retain one-request assertion,
  all five quests, wrong-answer paths, checkpoint and restart checks.
- `tests/inspection.spec.ts`: use readiness helper and verify the intercepted 503
  and real rendering after retry. All original inspection assertions remain.
- `tests/foundation.spec.ts`: wait for the lazy briefing renderer and initialized
  Three context; retain navigation, preferences, sources and real geometry checks.
- `docs/level-2-regression-cases.txt`: exact original eleven cases for focused runs.

The quest engine, scientific content, storage behavior, original NASA GLB,
dependencies and five-quest progression were not replaced or rewritten.

## Execution environment

Direct HTTP from this Codex process remains denied (Node fetch reports EACCES).
Browser validation therefore uses the existing `ECHOES_STATIC_TESTS=1` transport
and the installed browser cache via PLAYWRIGHT_BROWSERS_PATH. Actual bundled React,
Three.js, GLB, embedded textures, local Draco WASM, WebGL, IndexedDB and UI input
execute in Chromium. The test transport changes delivery only, not game behavior.

A build with NODE_ENV=development was used deliberately to exercise React's real
StrictMode effect replay. Development React's `react-stack-top-frame` marker was
verified in the resulting bundle. The final build has been restored to production.
Normal Vite HTTP delivery in the user's CMD remains a distinct manual verification
when the host cannot execute that path.

## Final regression results

- Final `npm run lint`: passed, exit 0.
- Final `npm exec -- tsc --noEmit --incremental false`: passed, exit 0.
- Final production `npm run build`: passed, exit 0 (4.34 seconds); the existing
  shared 3D chunk size warning remains. Output hashes match the tested bundle.
- Original eleven reported failures: **11 passed with two workers (5.4 minutes)**
  after fixing renderer initialization, loader replay and route readiness.
- Broader checks revealed two more lazy-entry gaps; the four focused desktop and
  portrait foundation/checkpoint cases then passed together (7.7 seconds).
- **Final complete suite: 59 passed, 0 failed, 0 skipped, two workers, 5.0 minutes.**
  No retry setting was enabled to obtain this result. The development-build
  investigation had also passed the one-request assertion in all five complete
  mission playthroughs under real React StrictMode replay.
- Earlier diagnostic runs included pixel failures, lazy-entry failures and total
  deadline exhaustion. They are documented above and are not reported as passes.
  One diagnostic run was deliberately interrupted after recording deadline
  failures before applying the two whole-flow budget corrections.

The full suite executes the genuine production bundle, original NASA GLB, local
Draco decoder, live WebGL and actual IndexedDB. All 59 tests remain. The final
result includes the foundation, five viewports, complete missions, single GLB
request, persistence, hints, wrong answers, retries, restart and real pixel checks.

Normal HTTP delivery is still unverified on this host, which denies loopback
access. Remaining Windows CMD verification:

```cmd
cd /d "C:\Users\Admin\Desktop\ECHOES 0F EXPLORATION"
set "ECHOES_STATIC_TESTS="
npm run test:e2e -- --workers=2
```

Status: regression fixes complete and full automated suite passed through the
available browser transport; **conditionally ready** pending normal HTTP delivery
validation. No Level 3 work or deployment was performed.
