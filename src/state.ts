export const targets=[0,1,3] as const;
export const code=[0,2,1] as const;
export type Phase='waiting'|'charging'|'lit';
export interface Save{rotors:number[];lens:number;focused:boolean;signal:boolean;lit:boolean}
export interface World{active:string;progress:number;velocity:number;direction:number;pointer:{x:number;y:number};opening:number;charge:number;phase:Phase;save:Save;motion:boolean;hidden:boolean;sound:boolean;volume:number;signalStep:number;impact:number}
export const clamp=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const fresh=():Save=>({rotors:[3,0,1],lens:24,focused:false,signal:false,lit:false});
export function powered(s:Save){return s.rotors.every((v,i)=>v===targets[i]);}
export function ready(s:Save){return powered(s)&&s.focused&&s.signal;}
export function count(s:Save){return Number(powered(s))+Number(s.focused)+Number(s.signal);}
export function restore(raw:string|null):Save{try{const s=JSON.parse(raw||'null');if(!s||!Array.isArray(s.rotors)||s.rotors.length!==3||!s.rotors.every((v:unknown)=>Number.isInteger(v)&&Number(v)>=0&&Number(v)<4))return fresh();const lens=Number.isFinite(s.lens)?clamp(s.lens,0,100):24;const value:Save={rotors:s.rotors,lens,focused:s.focused===true&&Math.abs(lens-64)<=4,signal:s.signal===true,lit:false};value.lit=s.lit===true&&ready(value);return value;}catch{return fresh();}}
export function rotate(s:Save,index:number):Save{if(powered(s)||index<0||index>2)return s;const rotors=s.rotors.map((v,i)=>i===index?(v+1)%4:v);return{...s,rotors};}
export function focus(s:Save){return Math.abs(s.lens-64)<=4?{...s,focused:true}:s;}
export function tap(step:number,pad:number){return code[step]===pad?{step:step+1,correct:true}:{step:pad===code[0]?1:0,correct:false};}
export function progress(top:number,height:number,viewport:number){return clamp(-top/Math.max(1,height-viewport));}
export function velocity(previous:number,y:number,lastY:number,height:number,dt:number){const raw=clamp((y-lastY)/Math.max(1,height)/Math.max(.001,dt),-4,4);return{speed:previous+(raw-previous)*(1-Math.exp(-dt/(Math.abs(raw)>Math.abs(previous)?.085:.38))),direction:Math.sign(raw)};}
export class Gate{private seen=new Map<string,number>();allow(key:string,now:number,delay=.2){const last=this.seen.get(key)??-Infinity;if(now-last<delay)return false;this.seen.set(key,now);return true;}}
