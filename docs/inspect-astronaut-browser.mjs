/* global console, localStorage */
import { chromium } from '@playwright/test'
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}})
 await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1',JSON.stringify({reducedMotion:true,sound:false})))
 page.on('pageerror',e=>console.error('PAGEERROR',e.stack))
 await page.goto('http://127.0.0.1:4173/')
 await page.getByRole('button',{name:'Meet Your Space Explorer',exact:true}).click()
 await page.locator('[data-model-state="loaded"]').waitFor({timeout:30000})
 await page.locator('canvas[data-engine]').waitFor({timeout:30000})
 await page.locator('canvas').scrollIntoViewIfNeeded()
 await page.locator('canvas').screenshot({path:'docs/astronaut-overview.png'})
 console.log(await page.locator('.spacecraft-viewport').evaluate(e=>({dataset:{...e.dataset}})))
 for(const name of ['Helmet','Spacesuit','Gloves','Boots']) {await page.getByRole('group',{name:'Spacesuit components'}).getByRole('button',{name,exact:true}).click();await page.locator('canvas').scrollIntoViewIfNeeded();await page.locator('canvas').screenshot({path:'docs/astronaut-'+name.toLowerCase()+'.png'})}
 console.log('ASTRONAUT DONE')
 await page.getByRole('button',{name:'Close space explorer',exact:true}).click()
 console.log('ASTRONAUT CLOSED')
 await page.getByRole('button',{name:'Mission Journeys',exact:true}).click()
 console.log('JOURNEY OPENED')
 await page.getByRole('button',{name:'Show 3D mission display objects',exact:true}).click()
 await page.locator('.journey-object-display canvas[data-engine]').waitFor({timeout:30000})
 await page.getByText('Display objects ready.',{exact:true}).waitFor({timeout:30000})
 await page.locator('.journey-object-display canvas').scrollIntoViewIfNeeded()
 await page.locator('.journey-object-display canvas').screenshot({path:'docs/apollo-display-objects.png'})

} finally {await browser.close()}
