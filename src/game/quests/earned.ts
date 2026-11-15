import { create } from 'zustand'
import { restoreProgress, type MissionConfig, type Progress } from './engine'
interface Earned { proofs: Record<string, Progress>; remember: (config: MissionConfig, raw: unknown) => void }
export const useEarnedStore = create<Earned>(set => ({ proofs: {}, remember: (config, raw) => {
 const valid = restoreProgress(config,raw)
 if (!valid?.completed.length) return
 set(state => valid.completed.length > (state.proofs[config.id]?.completed.length ?? 0) ? {proofs:{...state.proofs,[config.id]:valid}} : state)
}}))
export function awardSummary(configs: MissionConfig[], proofs: Record<string, unknown>) {
 const awards: {id:string; label:string; xp:number}[]=[]
 let complete=0
 for (const config of configs) {
  const proof=restoreProgress(config,proofs[config.id]); if(!proof) continue
  for(const id of proof.completed) awards.push({id:`quest:${config.id}:${id}`,label:config.quests.find(q=>q.id===id)!.title,xp:100})
  if(proof.phase==='complete') { complete++; awards.push({id:`mission:${config.id}`,label:`${config.story?.label ?? config.title} investigation complete`,xp:200}) }
 }
 if(complete===configs.length) awards.push({id:'flagships:v1',label:'Three worlds, one explorer',xp:300})
 return {awards,xp:awards.reduce((n,a)=>n+a.xp,0),quests:awards.filter(a=>a.id.startsWith('quest:')).length}
}
