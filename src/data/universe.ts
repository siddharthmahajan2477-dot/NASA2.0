import { apolloMission } from '../game/quests/apollo'
import { ingenuityMission } from '../game/quests/ingenuity'
import { nearMission } from '../game/quests/near'
import { ingenuityReference } from './ingenuityRecords'
import { nearReference } from './nearRecords'
import { useApolloQuestStore } from '../game/quests/store'
import { useIngenuityQuestStore } from '../game/quests/ingenuityStore'
import { useNearQuestStore } from '../game/quests/nearStore'
import type { Screen } from '../app/store'
export const missions = [apolloMission,nearMission,ingenuityMission]
export const stores = [useApolloQuestStore,useNearQuestStore,useIngenuityQuestStore]
export const routes: Record<string,Screen> = {'apollo-11':'inspection','near-shoemaker':'near-inspection',ingenuity:'ingenuity-inspection'}
export const apolloTimeline = [
 ['1969-07-16','Launch from Earth','A Saturn V launches the crew and their docked spacecraft toward the Moon.'],
 ['1969-07-19','Lunar orbit insertion','A service-module engine burn slows the spacecraft into lunar orbit.'],
 ['1969-07-20','Eagle lands in the Sea of Tranquility','Armstrong and Aldrin land while Collins remains in lunar orbit aboard Columbia.'],
 ['1969-07-21','Surface exploration begins (UTC)','The first steps occur on July 21 UTC, still July 20 in US Eastern time. The crew examines and samples the surface.'],
 ['1969-07-21','EASEP deployment','PSEP and LRRR begin different kinds of lunar investigations. This is EASEP, not the later expanded ALSEP.'],
 ['1969-07-21','Ascent from the Moon','Only the ascent stage leaves. The descent stage remains as the launch platform.'],
 ['1969-07-21','Rendezvous and docking with Columbia','The crew and samples transfer back to the command and service module in lunar orbit.'],
 ['1969-07-22','Departure from lunar orbit (UTC)','The service propulsion system starts the journey back to Earth.'],
 ['1969-07-24','Return and splashdown','Columbia returns the crew to the Pacific Ocean.']
].map(([date,event,body],i)=>({id:`apollo-11:${i}`,missionId:'apollo-11',date,event,body,sources:[{title:'NASA Apollo chronology (GMT/UTC)',url:'https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm'},{title:'NASA Apollo mission overview',url:apolloMission.sources.mission.url}]}))
export const references = {'near-shoemaker':nearReference,ingenuity:ingenuityReference}
const recordIds:Record<string,string[]>={'near-shoemaker':['route','route','route','delay','orbit','orbit','orbit','landing','signal','legacy'],ingenuity:['arrival','arrival','arrival','night-survival','original-plan','operations-demo','seventy-two','final-flight','damage-evidence','likely-scenario']}
export const timeline = [...apolloTimeline,...[nearMission,ingenuityMission].flatMap(m=>references[m.id as keyof typeof references].timeline.map((e,i)=>({id:`${m.id}:${i}`,missionId:m.id,date:/^\d{4}-/.test(e.date)?e.date:new Date(e.date+' UTC').toISOString().slice(0,10),event:e.event,body:m.evidence.find(r=>r.id===recordIds[m.id][i])?.body ?? m.story!.entryText,sources:e.sourceIds.map(id=>m.sources[id])})))].sort((a,b)=>a.date.localeCompare(b.date)||missions.findIndex(m=>m.id===a.missionId)-missions.findIndex(m=>m.id===b.missionId))
export const souvenirs = [
 {id:'souvenir:apollo-11:v1',missionId:'apollo-11',title:'The Descent Stage Memory',meaning:'A symbolic memory of the platform that let the crew leave the Moon.',source:apolloMission.sources.mission},
 {id:'souvenir:ingenuity:v1',missionId:'ingenuity',title:'Seventy-Two Flights Memory',meaning:'A symbolic tribute to the five-flight experiment that kept finding useful work.',source:ingenuityMission.sources.legacy},
 {id:'souvenir:near-shoemaker:v1',missionId:'near-shoemaker',title:'The Eros Landing Memory',meaning:'A symbolic memory of a planned descent and the science that followed touchdown.',source:nearMission.sources.surface}
]

const reasons: Record<string,string[]> = {
 'apollo-11':['The landing mission needed to launch both a surface vehicle and the spacecraft that would bring the crew home.','Orbit gave Eagle a place to leave Columbia and a place to meet it again.','Landing made surface investigation possible while a crewmate maintained the route home.','Direct observation and returned samples gave scientists evidence beyond remote pictures.','Ground vibrations and timed laser returns answered different questions about the Moon.','Leaving the descent stage saved the ascent stage from carrying the entire lander back up.','The surface crew needed Columbia for the return to Earth; liftoff alone was not the end of the rescue chain.','A separate departure burn connected lunar rendezvous to the journey home.','A successful landing also required returning people and evidence safely.'],
 'near-shoemaker':['The mission began as a rendezvous investigation, not a purpose-built landing attempt.','A brief encounter could reveal another asteroid without becoming the main rendezvous target.','The Earth encounter helped reshape the route to a moving target.','The missed maneuver required a new plan rather than an immediate orbital arrival.','Remaining near Eros made repeated measurements possible.','Different viewing distances supported different investigations.','Lower centre distance did not mean a constant gap above an irregular surface.','A deliberately controlled descent created an opportunity beyond the original orbiter design.','A surviving signal let the team prioritise new composition measurements.','The transmissions ended, but the returned measurements remained available for research.'],
 ingenuity:['The helicopter depended on the rover mission to reach Mars.','Arrival was only the beginning: Ingenuity still had to deploy and survive independently.','Deployment removed the rover power connection and exposed the aircraft to independent operations.','Stored energy and thermal protection mattered before there could be another flight.','Controlled flight answered the original engineering question.','Completing the demonstration let the team investigate additional operational roles.','Repeated flights extended the engineering experience far beyond five tests.','The final flight left evidence about the limits of visual navigation.','Observed damage ended flying without erasing the earlier results.','A useful engineering explanation must retain the uncertainty in the evidence.']
}
export function eventMeaning(id:string){const [mission,index]=id.split(':');return reasons[mission][Number(index)]}
