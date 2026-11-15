# Level 6 — targeted YouTube integration (2026-11-15)

This update supersedes the earlier missing-MP4 limitation. Four approved videos are configured on the three existing mission-film routes. No gameplay, journey, archive, narration, rewards or persistence implementation changed.

## Verified metadata
YouTube's official /oembed endpoint returned JSON titles, creator names, channel URLs and iframe HTML for all four IDs on 2026-11-15:

| Mission / choice | Video ID | Exact returned title | Publisher |
|---|---|---|---|
| Apollo / Featured Film (default) | DWm3mywDMrM | Apollo 11 &#124; 3D Animated Short Film Made in Blender | Paweł Chądzyński |
| Apollo / Full Mission Journey | JcvMAL_lTHU | Apollo 11 Moon Landing - 8 days in 5 minutes - 4K | Anim Mate |
| Ingenuity | qMbHE_VXI-8 | Legacy of NASA’s Ingenuity Mars Helicopter | NASA Jet Propulsion Laboratory |
| NEAR Shoemaker | CFUmUIU_tXY | NEAR Descent Animation | NASA Solar System |

Both Apollo titles identify Apollo 11 animations. They are credited as independent works, not NASA productions or archival footage. The second title's 4K wording is attributed to its creator; no resolution is forced or promised. No runtime, broader license, complete frame-by-frame historical review or regional playback availability is asserted.

Official oEmbed URLs: https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json (substitute the IDs above). Direct watch links and channel credits are retained in the UI. Direct privacy-enhanced embed HTML was also received for all four, but no usable player playability status could be extracted. An iframe response is not proof of playback.

## Behaviour
- Exactly three existing film screens; two accessible choice buttons on Apollo's same page.
- No thumbnails, player SDK or iframe requests before Watch Film.
- Only one selected privacy-enhanced youtube-nocookie.com iframe; autoplay=0, controls=1, fullscreen, inline playback, explicit referrer policy. Original hosted video and native controls; no download, rip, local copy, rehosting, forced resolution or new dependency.
- Responsive 16:9 frame. Switching removes the old iframe; leaving destroys the component. Watch Again replaces the paused player; native Play starts playback. Stop removes it. Global mute preference supplies the initial mute parameter.
- Visible direct YouTube link, provider/data notice, source/creator credits, manual Video unavailable? fallback and Retry. No false claim to detect every cross-origin playback failure.
- Skip/Continue immediately reach existing briefings, regardless of player state. Existing quick entry/resume and briefing return links unchanged.
- Missing or malformed configured ID displays a useful introduction instead of a broken player. No stale missing-MP4 messaging.

## Scope of changes
- src/data/missionFilms.ts — typed choices, four verified metadata records, shared embed/watch URL builders.
- src/components/MissionFilm.tsx — selected-film state, opt-in iframe lifecycle, fallback/retry/replay and credits.
- src/styles/index.css — film selector, actions and responsive player styles only.
- tests/premium.spec.ts — retained navigation assertions updated for configured/deferred YouTube playback.
- tests/mission-films.spec.ts — five focused scenarios across five viewports; iframe isolation, IDs, no autoplay, selection, blocked player, retry, links, responsive layout, completed-save preservation and return controls.
- docs/level-6-youtube-browser-check.json — actual external browser check, no player stubs.

## Validation checkpoint
25/25 focused integration tests passed over normal production HTTP with two workers. These tests stub the external iframe or abort its request deliberately; they verify the application integration, not YouTube's streaming service. Initial combined two-mission test exceeded the default total budget under host load; split into independent mission cases with all assertions and deadlines retained.

Actual non-stubbed Chromium check: all four external iframes remained blank (no video element or advancing playback). See the JSON record. Playback was not verified in this host. Official provider metadata/iframe checks succeeded, but final human playback confirmation is still required on an unrestricted browser/network. The application cannot guarantee availability, cookie/region/age/owner restrictions or YouTube uptime.

Reference implementation docs: https://developers.google.com/youtube/player_parameters and https://support.google.com/youtube/answer/171780 . No fake NASA endorsement or transfer of third-party rights is implied.

Final lint/TypeScript/build and complete regression result pending. No deployment or Level 7.

## Validation recovery after Windows shutdown — 2026-11-15
No application source, test code, test configuration, assertions or deadlines were changed during recovery. No new full regression was launched. Previous reports and traces remain untouched; new diagnostics use distinct test-results-recovery subdirectories.

- Old 237-test run: incomplete; no final summary or last-run receipt. Nine saved failure contexts. Aggregate pass/fail/skip totals cannot be recovered reliably. The saved HTML report is the earlier 25/25 focused film run, not a full-suite result.
- Old six-case desktop diagnostic: incomplete; two saved NEAR timeout contexts, no aggregate summary. Original terminal no longer exists. No visible Node/Chromium processes remained before restart.
- Apollo partial-save/refresh recovery, desktop, one worker: 1 passed, 0 failed, 0 skipped, 43.5 seconds (previous recovery). Its original trace confirms the expected saved objectives and answer restored before the total timeout.
- Current-boot NEAR diagnostic, desktop, two workers: 0 passed, 2 failed, 0 skipped. Both existing 240-second total budgets expired. The completed-mission trace reached its expected finale; the saved-progress trace reached finale, refresh recovery and confirmed restart. No page errors were recorded in either trace. Ordinary clicks took several seconds each. Files: test-results-recovery/near-after-reconnect/.last-run.json and its two trace.zip/error-context.md pairs.
- Same saved-progress NEAR test, desktop, one worker: 1 passed, 0 failed, 0 skipped, 2.1 minutes. Files: test-results-recovery/near-single-worker/.last-run.json.

These results support concurrency-sensitive host/browser runtime pressure; the exact CPU/GPU/IO bottleneck was not measured. No functional YouTube/persistence defect was demonstrated. This does NOT convert the two-worker failures into passes. Under the instruction to report resource blockers instead of repeatedly restarting the whole suite, no clean full run was launched after the confirmed concurrent timeout reproduction.

Earlier lint, TypeScript, production build and 25 focused film tests remain passed; no source changes required repeating those checks. All four video IDs remain configured across the three existing film pages. External YouTube playback remains unverified in this host; provider oEmbed metadata/iframe checks succeeded earlier. No download/rehosting, deployment or Level 7.

Final validation status: INCOMPLETE / blocked on a clean 237-test two-worker regression under sufficient execution resources. To validate the unchanged production build manually, start npm run preview -- --host 127.0.0.1 --port 4173 --strictPort in one CMD window, then run npm run test:e2e -- --workers=2 --output=test-results-recovery/final in another, from this project. To preserve the old HTML report, set PLAYWRIGHT_HTML_OUTPUT_DIR=playwright-report-recovery/final in the test CMD window first.
