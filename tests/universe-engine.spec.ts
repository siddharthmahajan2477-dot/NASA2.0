import { test, expect } from '@playwright/test'
import { missions, timeline } from '../src/data/universe'
import { archiveProfile } from '../src/data/archiveProfiles'
import { awardSummary } from '../src/game/quests/earned'
import { completed } from './universe-fixtures'

test('unified timeline is chronologically ordered with primary sources and full archive profiles',()=>{expect(timeline).toHaveLength(29);expect(timeline.map(e=>e.date)).toEqual(timeline.map(e=>e.date).sort());for(const m of missions){const profile=archiveProfile(m.id);expect(profile.sections).toHaveLength(18);for(const section of profile.sections){expect(section.body.length).toBeGreaterThan(30);expect(section.sources.length).toBeGreaterThan(0)}}for(const e of timeline){expect(e.body.length).toBeGreaterThan(30);expect(e.sources.length).toBeGreaterThan(0)}})
test('validated receipts award exactly once with stable IDs, retroactive credit and all-mission souvenirs eligibility',()=>{const proofs=Object.fromEntries(missions.map(m=>[m.id,completed(m)]));const a=awardSummary(missions,proofs);expect(a.xp).toBe(2600);expect(a.quests).toBe(17);expect(new Set(a.awards.map(a=>a.id)).size).toBe(a.awards.length);expect(awardSummary(missions,structuredClone(proofs))).toEqual(a);expect(a.awards.filter(a=>a.id.startsWith('mission:'))).toHaveLength(3)})
test('future, forged incomplete, cross-mission and arbitrary XP records cannot award credit',()=>{const good=completed(missions[0]);expect(awardSummary(missions,{[missions[0].id]:{...good,version:7},xp:999999}).xp).toBe(0);expect(awardSummary(missions,{ingenuity:good}).xp).toBe(0);expect(awardSummary(missions,{[missions[0].id]:{...good,answers:{}}}).xp).toBe(0);expect(awardSummary(missions,{}).quests).toBe(0)})
