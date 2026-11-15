# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: near.spec.ts >> NEAR complete mission remains playable without journey storage
- Location: tests\near.spec.ts:18:1

# Error details

```
Test timeout of 240000ms exceeded.
```

```
Error: locator.press: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e5]:
    - button "Echoes of Exploration home" [ref=e6] [cursor=pointer]:
      - generic [aria-hidden] [ref=e7]: ◌
      - generic [ref=e8]: ECHOES OF EXPLORATION
    - generic [ref=e9]: INDEPENDENT SCIENCE ADVENTURE / NEAR SHOEMAKER / EROS
    - navigation "Connected exploration" [ref=e10]:
      - button "Chronosphere" [ref=e11] [cursor=pointer]
      - button "Space Memory Archive" [ref=e12] [cursor=pointer]
      - button "Mission Journeys" [ref=e13] [cursor=pointer]
      - button "Explorer Progress" [ref=e14] [cursor=pointer]
    - generic [ref=e15]:
      - generic [ref=e16]: The missions ended. Their stories live on.
      - strong [ref=e17]: OBSERVE. READ. SOLVE.
  - main [ref=e18]:
    - generic [ref=e19]:
      - button "Back to briefing" [ref=e20] [cursor=pointer]
      - paragraph [ref=e21]: ECHOES OF EXPLORATION / FIELD NOTES
      - heading "The Landing Nobody Designed For" [level=1] [ref=e22]
      - generic [ref=e23]:
        - paragraph [ref=e24]: Built to look down. Still speaking from the ground.
        - region "NEAR investigation" [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - paragraph [ref=e28]: NEAR SHOEMAKER / INVESTIGATION 5 OF 6
              - heading "The Landing Nobody Designed For" [level=2] [ref=e29]
            - button "Restart investigation" [ref=e30] [cursor=pointer]
          - list "Mission progress" [ref=e31]:
            - listitem [ref=e32]:
              - generic [ref=e33]: "1"
              - generic [ref=e34]:
                - text: Chasing a Moving Rock
                - generic [ref=e35]: completed
            - listitem [ref=e36]:
              - generic [ref=e37]: "2"
              - generic [ref=e38]:
                - text: A World Without a World's Shape
                - generic [ref=e39]: completed
            - listitem [ref=e40]:
              - generic [ref=e41]: "3"
              - generic [ref=e42]:
                - text: Holding Orbit Around Eros
                - generic [ref=e43]: completed
            - listitem [ref=e44]:
              - generic [ref=e45]: "4"
              - generic [ref=e46]:
                - text: Reading the Asteroid
                - generic [ref=e47]: completed
            - listitem [ref=e48]:
              - generic [ref=e49]: "5"
              - generic [ref=e50]:
                - text: The Landing Nobody Designed For
                - generic [ref=e51]: active
            - listitem [ref=e52]:
              - generic [ref=e53]: "6"
              - generic [ref=e54]:
                - text: The Signal That Continued
                - generic [ref=e55]: locked
          - paragraph [ref=e56]: There were no landing legs to unfold. The team chose to descend anyway.
          - group [ref=e57]:
            - generic "Helmet Listen Mode" [ref=e58] [cursor=pointer]
            - option "0.75×"
            - option "1×" [selected]
            - option "1.25×"
            - option "1.5×"
          - list "Current objectives" [ref=e61]:
            - listitem [ref=e62]:
              - generic [aria-hidden] [ref=e63]: ✓
              - text: Inspect Controlled descent
              - generic [ref=e64]: completed
            - listitem [ref=e65]:
              - generic [aria-hidden] [ref=e66]: ✓
              - text: Collect An orbiter, deliberately brought down
              - generic [ref=e67]: completed
            - listitem [ref=e68]:
              - generic [aria-hidden] [ref=e69]: ✓
              - text: Collect South of Himeros
              - generic [ref=e70]: completed
            - listitem [ref=e71]:
              - generic [aria-hidden] [ref=e72]: ○
              - text: Validate the evidence-based reconstruction
          - link "Open evidence & reconstruction ↓" [ref=e73] [cursor=pointer]:
            - /url: "#quest-workbench"
          - paragraph [ref=e74]: Your investigation still works in this session, but the latest progress could not be saved. Keep this page open to continue.
        - generic [ref=e75]:
          - paragraph [ref=e76]: Drag to orbit · Scroll or pinch to zoom · Select a numbered component
          - button "Reset camera" [ref=e77] [cursor=pointer]
        - generic [ref=e78]:
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic:
                - button "Inspect Solar arrays" [ref=e81] [cursor=pointer]: "1"
                - button "Inspect High-gain antenna" [ref=e82] [cursor=pointer]: "2"
                - button "Inspect Spacecraft body" [pressed] [ref=e83] [cursor=pointer]: "3"
            - paragraph [ref=e87]:
              - text: EROS / ILLUSTRATIVE DISPLAY STAGING
              - generic [ref=e88]: Illustrative reconstruction, not surveyed landing-site topography.
          - complementary "Spacecraft component notes" [ref=e89]:
            - paragraph [ref=e90]: FIELD INVESTIGATION / NEAR SHOEMAKER
            - heading "An orbiter with another chapter ahead." [level=2] [ref=e91]
            - paragraph [ref=e92]: Explore the spacecraft, then follow the Eros journey below the quest workbench.
            - group "Choose a spacecraft component" [ref=e93]:
              - button "Solar arrays" [ref=e94] [cursor=pointer]:
                - generic [aria-hidden] [ref=e95]: "01"
                - text: Solar arrays
              - button "High-gain antenna" [ref=e96] [cursor=pointer]:
                - generic [aria-hidden] [ref=e97]: "02"
                - text: High-gain antenna
              - button "Spacecraft body" [pressed] [ref=e98] [cursor=pointer]:
                - generic [aria-hidden] [ref=e99]: "03"
                - text: Spacecraft body
            - group [ref=e100]:
              - generic "Spacecraft body · field note" [ref=e101] [cursor=pointer]
              - generic [ref=e102]:
                - paragraph [ref=e103]: ENGINEERING NOTE
                - heading "Spacecraft body" [level=3] [ref=e104]
                - paragraph [ref=e105]: The central spacecraft structure supports and protects the onboard systems and instrument payload.
                - paragraph [ref=e106]: It was an orbiter, with no purpose-built landing legs. Visible structure is not proof of a hidden instrument location.
                - link "NASA spacecraft history ↗" [ref=e107] [cursor=pointer]:
                  - /url: https://science.nasa.gov/mission/near-shoemaker/
                - button "Close component note" [ref=e108] [cursor=pointer]
        - region "Evidence and reconstruction" [ref=e109]:
          - generic [ref=e110]:
            - paragraph [ref=e111]: FIELD RECORDS / 9 DISCOVERED
            - heading "Inspect. Read. Make the connection." [level=2] [ref=e112]
            - paragraph [ref=e113]: Use the spacecraft above to inspect required components. Open the records below, then collect the evidence you need.
          - generic [ref=e114]:
            - group [ref=e115]:
              - generic "An orbiter, deliberately brought down Collected" [ref=e116] [cursor=pointer]:
                - text: An orbiter, deliberately brought down
                - generic [ref=e117]: Collected
              - generic [ref=e118]:
                - paragraph [ref=e119]: NEAR Shoemaker / 433 Eros
                - paragraph [ref=e120]: The spacecraft had no purpose-built landing gear. After a year of orbital study, planners chose a slow controlled descent on February 12, 2001. It photographed the surface on the way down and survived contact.
                - generic [ref=e121]:
                  - heading "Why this matters" [level=4] [ref=e122]
                  - paragraph [ref=e123]: Not designed as a lander does not mean an accidental crash. A planned descent managed risk without guaranteeing survival.
                - paragraph [ref=e124]:
                  - strong [ref=e125]: "Why it matters:"
                  - text: Not designed as a lander does not mean an accidental crash. A planned descent managed risk without guaranteeing survival.
                - list [ref=e126]:
                  - listitem [ref=e127]:
                    - link "NASA mission history (opens in a new tab)" [ref=e128] [cursor=pointer]:
                      - /url: https://science.nasa.gov/mission/near-shoemaker/
                      - text: NASA mission history
                      - generic [ref=e129]: (opens in a new tab)
                  - listitem [ref=e130]:
                    - link "JHUAPL spacecraft and teams (opens in a new tab)" [ref=e131] [cursor=pointer]:
                      - /url: https://www.jhuapl.edu/destinations/missions/near
                      - text: JHUAPL spacecraft and teams
                      - generic [ref=e132]: (opens in a new tab)
                - 'button "Collected: An orbiter, deliberately brought down" [disabled] [ref=e133]'
            - group [ref=e134]:
              - generic "South of Himeros Collected" [ref=e135] [cursor=pointer]:
                - text: South of Himeros
                - generic [ref=e136]: Collected
              - generic [ref=e137]:
                - paragraph [ref=e138]: NEAR Shoemaker / 433 Eros
                - paragraph [ref=e139]: NASA describes touchdown south of the saddle-shaped Himeros region. The official landing-site mosaic shows the planned site with south toward the top.
                - generic [ref=e140]:
                  - heading "Why this matters" [level=4] [ref=e141]
                  - paragraph [ref=e142]: This STL has no verified registration to the published geographic frame. Use the official image for regional context; there is no exact geographic pin on our mesh.
                - paragraph [ref=e143]:
                  - strong [ref=e144]: "Why it matters:"
                  - text: This STL has no verified registration to the published geographic frame. Use the official image for regional context; there is no exact geographic pin on our mesh.
                - list [ref=e145]:
                  - listitem [ref=e146]:
                    - link "NASA/JPL/JHUAPL landing-site image (opens in a new tab)" [ref=e147] [cursor=pointer]:
                      - /url: https://science.nasa.gov/photojournal/location-of-the-near-shoemaker-landing-site/
                      - text: NASA/JPL/JHUAPL landing-site image
                      - generic [ref=e148]: (opens in a new tab)
                  - listitem [ref=e149]:
                    - link "NASA mission history (opens in a new tab)" [ref=e150] [cursor=pointer]:
                      - /url: https://science.nasa.gov/mission/near-shoemaker/
                      - text: NASA mission history
                      - generic [ref=e151]: (opens in a new tab)
                - 'button "Collected: South of Himeros" [disabled] [ref=e152]'
          - generic [ref=e153]:
            - heading "Listen to the evidence" [level=3] [ref=e154]
            - group [ref=e155]:
              - generic "Helmet Listen Mode" [ref=e156] [cursor=pointer]
              - option "0.75×"
              - option "1×" [selected]
              - option "1.25×"
              - option "1.5×"
            - group [ref=e159]:
              - generic "Helmet Listen Mode" [ref=e160] [cursor=pointer]
              - option "0.75×"
              - option "1×" [selected]
              - option "1.25×"
              - option "1.5×"
          - generic [ref=e163]:
            - paragraph [ref=e164]: YOUR RECONSTRUCTION
            - group "The Landing Nobody Designed For challenges" [ref=e165]:
              - group "Reconstruct the deliberate descent." [ref=e167]:
                - list "Reconstruct the deliberate descent." [ref=e169]:
                  - listitem [ref=e170]:
                    - generic [aria-hidden] [ref=e171]: "1"
                    - generic [ref=e172]: Study Eros from orbit
                    - generic [ref=e173]:
                      - button "Move Study Eros from orbit earlier" [disabled] [ref=e174]: ↑
                      - button "Move Study Eros from orbit later" [ref=e175] [cursor=pointer]: ↓
                  - listitem [ref=e176]:
                    - generic [aria-hidden] [ref=e177]: "2"
                    - generic [ref=e178]: Check the surviving signal
                    - generic [ref=e179]:
                      - button "Move Check the surviving signal earlier" [ref=e180] [cursor=pointer]: ↑
                      - button "Move Check the surviving signal later" [ref=e181] [cursor=pointer]: ↓
                  - listitem [ref=e182]:
                    - generic [aria-hidden] [ref=e183]: "3"
                    - generic [ref=e184]: Plan controlled descent maneuvers
                    - generic [ref=e185]:
                      - button "Move Plan controlled descent maneuvers earlier" [active] [ref=e186] [cursor=pointer]: ↑
                      - button "Move Plan controlled descent maneuvers later" [ref=e187] [cursor=pointer]: ↓
                  - listitem [ref=e188]:
                    - generic [aria-hidden] [ref=e189]: "4"
                    - generic [ref=e190]: Contact the surface
                    - generic [ref=e191]:
                      - button "Move Contact the surface earlier" [ref=e192] [cursor=pointer]: ↑
                      - button "Move Contact the surface later" [ref=e193] [cursor=pointer]: ↓
                  - listitem [ref=e194]:
                    - generic [aria-hidden] [ref=e195]: "5"
                    - generic [ref=e196]: Descend slowly while imaging
                    - generic [ref=e197]:
                      - button "Move Descend slowly while imaging earlier" [ref=e198] [cursor=pointer]: ↑
                      - button "Move Descend slowly while imaging later" [disabled] [ref=e199]: ↓
              - group "Keep the supported engineering conclusions." [ref=e200]:
                - generic [ref=e202]:
                  - generic [ref=e203] [cursor=pointer]:
                    - checkbox "Slow controlled descent reduced touchdown risk" [ref=e204]
                    - generic [ref=e205]: Slow controlled descent reduced touchdown risk
                  - generic [ref=e206] [cursor=pointer]:
                    - checkbox "No original landing gear guaranteed survival" [ref=e207]
                    - generic [ref=e208]: No original landing gear guaranteed survival
                  - generic [ref=e209] [cursor=pointer]:
                    - checkbox "Regional location is south of Himeros" [ref=e210]
                    - generic [ref=e211]: Regional location is south of Himeros
                  - generic [ref=e212] [cursor=pointer]:
                    - checkbox "This was an accidental crash" [ref=e213]
                    - generic [ref=e214]: This was an accidental crash
                  - generic [ref=e215] [cursor=pointer]:
                    - checkbox "Our mesh has a certified geographic landing pin" [ref=e216]
                    - generic [ref=e217]: Our mesh has a certified geographic landing pin
            - generic [ref=e218]:
              - button "Check reconstruction" [ref=e219] [cursor=pointer]
              - button "Show a hint" [ref=e220] [cursor=pointer]
              - button "Reset current challenge" [ref=e221] [cursor=pointer]
            - note [ref=e222]:
              - strong [ref=e223]: "Look again:"
              - text: Use the evidence records and compare what was measured with what the teaching graphics illustrate.
          - group [ref=e224]:
            - generic "Findings recovered so far" [ref=e225] [cursor=pointer]
        - region "Eros explorer and mission journey" [ref=e226]:
          - heading "Follow the journey to Eros" [level=2] [ref=e227]
          - paragraph [ref=e228]: Historical dates; schematic paths. No measured trajectory samples, physical display scale, geographic orientation or exact touchdown pin are claimed. Early cruise milestones are context, not a solar-system-scale route.
          - generic [ref=e229]:
            - generic [ref=e230]:
              - text: Illustrative approach progress (not telemetry)
              - slider "Illustrative approach progress (not telemetry)" [ref=e231]: "0"
            - button "Reset asteroid camera" [ref=e232] [cursor=pointer]
            - paragraph [ref=e233]: Swipe or drag to rotate; pinch or scroll to zoom. Display orientation is not a verified geographic frame.
            - paragraph [ref=e238]: NASA Eros STL; neutral illustrative material, not photographic surface colour. No invented craters. Original shape retained. The small light point represents approach progress, not spacecraft geometry or a geographic landing pin.
          - button "Record Eros shape observation" [ref=e239] [cursor=pointer]
          - navigation "Journey milestones" [ref=e240]:
            - 'button "1996-02-17: Launch from Earth" [ref=e241] [cursor=pointer]'
            - 'button "1997-06-27: Mathilde flyby" [ref=e242] [cursor=pointer]'
            - 'button "1998-01-23: Earth gravity assist" [ref=e243] [cursor=pointer]'
            - 'button "1998-12-23: Initial Eros flyby after the aborted burn" [ref=e244] [cursor=pointer]'
            - 'button "2000-02-14: Eros orbital insertion" [ref=e245] [cursor=pointer]'
            - 'button "2000-04-30: Operational orbit about 50 km from centre" [ref=e246] [cursor=pointer]'
            - 'button "2000-07-13: Lower orbital phase about 35 km from centre" [ref=e247] [cursor=pointer]'
            - 'button "2001-02-12: Controlled descent and touchdown south of Himeros" [pressed] [ref=e248] [cursor=pointer]'
            - 'button "2001-02-14: Surface gamma-ray science extension announced" [ref=e249] [cursor=pointer]'
            - 'button "2001-02-28: Last contact" [ref=e250] [cursor=pointer]'
          - generic [ref=e251]:
            - heading "Controlled descent and touchdown south of Himeros" [level=3] [ref=e252]
            - paragraph [ref=e253]: 2001-02-12
            - paragraph [ref=e254]: The open line illustrates moving inward rather than staying in orbit. Its endpoint is illustrative, not a registered landing coordinate.
          - button "Next journey stage" [ref=e255] [cursor=pointer]
          - group [ref=e256]:
            - 'generic "Approximate landing region: south of Himeros" [ref=e257]'
        - group [ref=e258]:
          - generic "NEAR Shoemaker — complete records & sources" [ref=e259] [cursor=pointer]
        - group [ref=e260]:
          - generic "About this reconstruction & sources" [ref=e261] [cursor=pointer]
  - contentinfo [ref=e262]:
    - generic [ref=e263]: LOOK CLOSER. THERE’S A STORY HERE.
    - generic [ref=e264]: Independent project. Not affiliated with or endorsed by NASA.
```

# Test source

```ts
  1  | import { test, expect } from './static-assets'
  2  | import type { Page } from '@playwright/test'
  3  | async function open(page:Page) { await page.goto('/'); await page.getByRole('button',{name:'Choose a mission',exact:true}).click(); await page.getByRole('button',{name:'Explore NEAR Shoemaker',exact:true}).click(); await page.getByRole('button', { name: 'Skip to Mission', exact: true }).click(); await page.getByRole('button',{name:'Inspect NEAR Shoemaker',exact:true}).click(); await expect(page.locator('.inspection')).toHaveAttribute('data-mission','near-shoemaker') }
  4  | async function frame(page:Page) { const v=page.locator('.spacecraft-viewport').first(); await expect(v).toHaveAttribute('data-model-state','loaded',{timeout:30000}); await expect(v).toHaveAttribute('data-model-triangles','9312'); const c=v.locator('canvas'); await expect(c).toHaveAttribute('data-engine',/^three/); await c.scrollIntoViewIfNeeded(); await expect.poll(()=>c.evaluate((c:HTMLCanvasElement)=>{const g=c.getContext('webgl2');if(!g||g.isContextLost())return 0;const p=new Uint8Array(g.drawingBufferWidth*g.drawingBufferHeight*4);g.readPixels(0,0,g.drawingBufferWidth,g.drawingBufferHeight,g.RGBA,g.UNSIGNED_BYTE,p);let n=0;for(let i=0;i<p.length;i+=4)if(p[i]>100&&p[i+1]>65&&p[i]>p[i+2]*1.3)n++;return n}),{timeout:20000}).toBeGreaterThan(50) }
  5  | const requirements=[['Solar arrays','1996-02-17:'],['shape'],['2000-04-30:'],['Spacecraft body'],['2001-02-12:'],['High-gain antenna','2001-02-14:']]
  6  | const choices=[['Meet a moving target','Use Earth encounter to change the trajectory'],['Surface clearance differs from centre distance','A named crater needs verified registration'],['February 14, 2000 insertion is historical','Our displayed loops are schematic'],['Combine shape, spectra and tracking','Recognise NIS stopped operating in May 2000'],['Slow controlled descent reduced touchdown risk','No original landing gear guaranteed survival','Regional location is south of Himeros'],['A planned landing extended an orbital mission','Survival enabled additional composition science']]
  7  | async function play(page:Page) { await page.getByRole('button',{name:'Begin investigation',exact:true}).click(); await expect(page.locator('.quest-progress [data-state="locked"]')).toHaveCount(5)
  8  | for(let q=0;q<6;q++) { await page.getByRole('button',{name:'Check reconstruction',exact:true}).click(); await expect(page.locator('.quest-feedback')).toHaveClass(/blocked/)
  9  | for(const action of requirements[q]) { if(action==='shape')await page.getByRole('button',{name:'Record Eros shape observation',exact:true}).click();else if(action.includes(':'))await page.getByRole('navigation',{name:'Journey milestones'}).getByRole('button',{name:new RegExp('^'+action)}).click();else await page.getByRole('group',{name:'Choose a spacecraft component'}).getByRole('button',{name:action,exact:true}).press('Enter') }
  10 | for(const card of await page.locator('.evidence-card').all()){if(await card.getAttribute('data-collected')==='true')continue;await card.locator('summary').click();await card.getByRole('button',{name:/Collect evidence:/}).click();await expect(card).toHaveAttribute('data-collected','true')}
  11 | await page.getByRole('button',{name:'Check reconstruction',exact:true}).click();await expect(page.locator('.quest-feedback')).toHaveClass(/incorrect/);await page.getByRole('button',{name:'Show a hint'}).press('Enter');await expect(page.getByRole('note')).toBeVisible()
> 12 | const board=page.locator('.sequence-board');if(await board.count()){const count=await board.locator('li').count();for(let target=0;target<count;target++){let pos=(await board.locator('li').evaluateAll(es=>es.map(e=>e.getAttribute('data-event-id')))).indexOf(String(target));while(pos>target){await board.locator('[data-event-id="'+target+'"]').getByRole('button',{name:/earlier$/}).press('Enter');pos--}}}
     |                                                                                                                                                                                                                                                                                                                                                                                               ^ Error: locator.press: Target page, context or browser has been closed
  13 | for(const [i,select] of (await page.locator('.reasoning-board select').all()).entries()) await select.selectOption(String(i))
  14 | for(const choice of choices[q])await page.getByRole('checkbox',{name:choice,exact:true}).check(); await page.getByRole('button',{name:'Check reconstruction',exact:true}).click();if(q<5){await expect(page.locator('.quest-feedback')).toHaveClass(/success/);await page.getByRole('button',{name:'Continue investigation'}).click()}}
  15 | await expect(page.locator('.mission-conclusion h2')).toHaveText('An orbiter reached the ground. Its work continued.') }
  16 | test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('echoes.preferences.v1',JSON.stringify({reducedMotion:true,sound:false})))})
  17 | test('NEAR full six-quest investigation, real assets, locking, feedback, save and restart',async({page})=>{test.setTimeout(240000);let requests=0;page.on('request',r=>{if(decodeURI(r.url()).endsWith('/NEAR Shoemaker.glb'))requests++});await open(page);await frame(page);await expect(page.getByRole('region',{name:'Eros explorer and mission journey'}).locator('canvas')).toHaveAttribute('data-engine',/^three/,{timeout:30000});await expect(page.locator('[data-eros-triangles]')).toHaveAttribute('data-eros-triangles','200856');await play(page);expect(requests).toBe(1);await open(page);await expect(page.locator('.mission-conclusion')).toBeVisible();await page.getByRole('button',{name:'Restart investigation'}).click();await page.getByRole('button',{name:'Confirm restart'}).click();await expect(page.locator('.quest-header h2')).toHaveText('Chasing a Moving Rock')})
  18 | test('NEAR complete mission remains playable without journey storage',async({page})=>{test.setTimeout(240000);await page.addInitScript(()=>{Object.defineProperty(window,'indexedDB',{get(){throw new Error('blocked')}})});await open(page);await play(page);await expect(page.locator('.quest-header .journey-storage')).toContainText(/session|save/i)})
  19 | test('Eros real pixels, orbit/descent labels, landing-region honesty, keyboard and responsive controls',async({page},info)=>{test.setTimeout(90000);await open(page);const c=page.getByRole('region',{name:'Eros explorer and mission journey'}).locator('canvas');await expect(c).toHaveAttribute('data-engine',/^three/,{timeout:30000});await c.scrollIntoViewIfNeeded();await expect.poll(()=>c.evaluate((e:HTMLCanvasElement)=>{const g=e.getContext('webgl2');if(!g)return 0;const p=new Uint8Array(g.drawingBufferWidth*g.drawingBufferHeight*4);g.readPixels(0,0,g.drawingBufferWidth,g.drawingBufferHeight,g.RGBA,g.UNSIGNED_BYTE,p);let n=0;for(let i=0;i<p.length;i+=4)if(p[i]>50&&p[i+1]>40)n++;return n}),{timeout:20000}).toBeGreaterThan(100);const initial=await c.getAttribute('data-camera-position');const box=(await c.boundingBox())!;const x=box.x+box.width/2,y=box.y+box.height/2;
  20 | if(info.project.use.hasTouch){const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-45,y:y+15}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(c).not.toHaveAttribute('data-camera-position',initial!);const rotated=await c.getAttribute('data-camera-position');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-20,y},{x:x+20,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-55,y},{x:x+55,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(c).not.toHaveAttribute('data-camera-position',rotated!);await cdp.detach()}else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-70,y+20,{steps:5});await page.mouse.up();await expect(c).not.toHaveAttribute('data-camera-position',initial!);const rotated=await c.getAttribute('data-camera-position');await page.mouse.wheel(0,-180);await expect(c).not.toHaveAttribute('data-camera-position',rotated!)}await page.getByRole('button',{name:'Reset asteroid camera'}).click();await expect(c).toHaveAttribute('data-camera-position',initial!);await page.getByRole('button',{name:/^2000-04-30:/}).press('Enter');await expect(page.getByText(/Loops distinguish/)).toBeVisible();await page.getByRole('button',{name:/^2001-02-12:/}).click();await expect(page.getByText(/endpoint is illustrative/)).toBeVisible();await page.getByRole('button',{name:'Reset asteroid camera'}).click();await page.getByText('Approximate landing region: south of Himeros',{exact:true}).click();await expect(page.getByRole('link',{name:/Official NASA landing-site/})).toHaveAttribute('href',/photojournal/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)})
  21 | test('NEAR spacecraft request failure recovers with retry',async({page})=>{await page.route('**/NEAR%20Shoemaker.glb',r=>r.fulfill({status:503,body:'unavailable'}));await open(page);await expect(page.getByRole('alert').filter({hasText:'could not be loaded'})).toBeVisible({timeout:30000});await page.unroute('**/NEAR%20Shoemaker.glb');await page.getByRole('button',{name:/Retry model/}).click();await frame(page)})
  22 | 
  23 | test('Eros request failure has usable notes and retry',async({page})=>{test.setTimeout(90000);await page.route('**/Asteroid%20433%20Eros.stl',r=>r.fulfill({status:503,body:'unavailable'}));await open(page);await expect(page.getByRole('alert').filter({hasText:'Eros could not be loaded'})).toBeVisible();await page.unroute('**/Asteroid%20433%20Eros.stl');await page.getByRole('button',{name:'Retry Eros model'}).click();await expect(page.getByRole('region',{name:'Eros explorer and mission journey'}).locator('canvas')).toHaveAttribute('data-engine',/^three/,{timeout:30000});await expect(page.locator('[data-eros-triangles]')).toHaveAttribute('data-eros-triangles','200856');await page.getByRole('button',{name:'Begin investigation',exact:true}).click();await expect(page.locator('.quest-header h2')).toHaveText('Chasing a Moving Rock')})
  24 | test('NEAR no WebGL keeps science, journey prerequisites and navigation usable',async({page})=>{await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,...args:Parameters<typeof original>){if(String(args[0]).includes('webgl'))return null;return original.apply(this,args)} as typeof original});await open(page);await expect(page.getByRole('alert').filter({hasText:/rendering is unavailable/}).first()).toBeVisible();await page.getByRole('button',{name:'Begin investigation',exact:true}).click();await page.getByRole('button',{name:/^1996-02-17:/}).press('Enter');await page.getByRole('group',{name:'Choose a spacecraft component'}).getByRole('button',{name:'Solar arrays',exact:true}).press('Enter');await expect(page.locator('.objective-tracker [data-done="true"]')).toHaveCount(2);await page.getByRole('button',{name:'Back to briefing',exact:true}).click();await expect(page.getByRole('button',{name:'Inspect NEAR Shoemaker',exact:true})).toBeVisible()})
  25 | test('Eros context loss preserves journey and genuine spacecraft component controls',async({page},info)=>{test.setTimeout(90000);await open(page);await frame(page);for(const name of ['Solar arrays','High-gain antenna','Spacecraft body']){await page.getByRole('group',{name:'Choose a spacecraft component'}).getByRole('button',{name,exact:true}).press('Enter');await expect(page.locator('.component-detail h3')).toHaveText(name);const marker=page.getByRole('button',{name:'Inspect '+name,exact:true});await marker.scrollIntoViewIfNeeded();if(info.project.use.hasTouch)await marker.tap();else await marker.click()};const c=page.getByRole('region',{name:'Eros explorer and mission journey'}).locator('canvas');await expect(c).toHaveAttribute('data-engine',/^three/);await c.evaluate(e=>{const g=(e as HTMLCanvasElement).getContext('webgl2');g?.getExtension('WEBGL_lose_context')?.loseContext()});await expect(page.getByRole('alert').filter({hasText:'Graphics context lost. Journey notes'})).toBeVisible();await page.getByRole('button',{name:/^2001-02-12:/}).press('Enter');await expect(page.getByText(/endpoint is illustrative/)).toBeVisible()})
  26 | 
```