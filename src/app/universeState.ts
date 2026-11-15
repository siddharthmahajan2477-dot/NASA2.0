import { create } from 'zustand'
export const useUniverseState = create<{mission:string;filter:string;year:string;event:string;compare:string[];record:string;set:(value:Partial<{mission:string;filter:string;year:string;event:string;compare:string[];record:string}>)=>void}>(set=>({mission:'apollo-11',filter:'all',year:'all',event:'apollo-11:0',compare:[],record:'',set:value=>set(value)}))
