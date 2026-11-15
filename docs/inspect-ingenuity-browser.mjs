/* global console, localStorage */
import { chromium } from '@playwright/test'
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try {
 const page=await browser.newPage({viewport:{width:1440,height:900}})
 await page.addInitScript(() => localStorage.setItem('echoes.preferences.v1',JSON.stringify({reducedMotion:true,sound:false})))
 page.on('pageerror',e=>console.error('PAGEERROR',e.message))
 await page.goto('http://127.0.0.1:4173/')
 await page.getByRole('button',{name:'Choose a mission',exact:true}).click()
 await page.getByRole('button',{name:'Explore Ingenuity',exact:true}).click()
 await page.getByRole('button',{name:'Inspect Ingenuity',exact:true}).click()
 await page.locator('[data-model-state="loaded"]').waitFor({timeout:30000})
 await page.locator('canvas[data-engine]').waitFor({timeout:30000})
 await page.locator('canvas').scrollIntoViewIfNeeded()
 await page.locator('canvas').screenshot({path:'docs/ingenuity-overview.png'})
 console.log(await page.locator('.spacecraft-viewport').evaluate(e=>({dataset:{...e.dataset},canvas:e.querySelector('canvas')?.getAttribute('data-engine')})))
 for(const name of ['Counter-rotating rotors','Solar panel','Electronics housing','Landing legs']) { await page.getByRole('group',{name:'Choose a spacecraft component'}).getByRole('button',{name,exact:true}).click(); await page.locator('canvas').scrollIntoViewIfNeeded(); await page.locator('canvas').screenshot({path:'docs/ingenuity-'+name.toLowerCase().replaceAll(' ','-')+'.png'}); console.log(name,await page.getByRole('button',{name:'Inspect '+name,exact:true}).isVisible()) }
 console.log('Direct browser HTTP model rendering completed')
} finally {await browser.close()}
