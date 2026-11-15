/* global console, localStorage */
import { chromium } from '@playwright/test'
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}})
 await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1',JSON.stringify({reducedMotion:true,sound:false})))
 page.on('pageerror',e=>console.error('PAGEERROR',e.message))
 await page.goto('http://127.0.0.1:4173/')
 await page.getByRole('button',{name:'Choose a mission',exact:true}).click()
 await page.getByRole('button',{name:'Explore NEAR Shoemaker',exact:true}).click()
 await page.getByRole('button',{name:'Inspect NEAR Shoemaker',exact:true}).click()
 await page.waitForTimeout(4000)
 console.log(await page.locator('main').innerText())
 await page.screenshot({path:'docs/near-debug.png'})
 await page.locator('canvas[data-engine]').first().waitFor({timeout:30000})
 await page.locator('canvas').first().scrollIntoViewIfNeeded()
 await page.locator('canvas').first().screenshot({path:'docs/near-overview.png'})
 console.log(await page.locator('.spacecraft-viewport').first().evaluate(e=>({dataset:{...e.dataset},canvas:e.querySelector('canvas')?.getAttribute('data-engine')})))

} finally {await browser.close()}
