import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,restore,rotate,powered,focus,ready,count,tap,progress,velocity,Gate} from '../src/state.ts';
test('only valid mechanisms restore, including malformed and unearned completion',()=>{
 assert.deepEqual(restore('{bad'),fresh());assert.deepEqual(restore('{"rotors":[99,0,1]}'),fresh());assert.equal(restore('{"rotors":[0,1,3],"lens":10,"focused":true,"signal":true,"lit":true}').lit,false);
 const q=restore('{"rotors":[0,1,3],"lens":64,"focused":true,"signal":true,"lit":true}');assert.equal(q.lit,true);assert.equal(count(q),3);
});
test('rotor puzzle needs real rotations and cannot accrue duplicate progress',()=>{let s=fresh();assert.equal(powered(s),false);s=rotate(rotate(rotate(rotate(s,0),1),2),2);assert.equal(powered(s),true);assert.equal(count(s),1);assert.equal(rotate(s,0),s);assert.equal(rotate(s,9),s);});
test('focus rejects imprecise inputs and the ready state requires all three tasks',()=>{const s=fresh();assert.equal(focus(s),s);const f=focus({...s,lens:64});assert.equal(f.focused,true);assert.equal(ready(f),false);assert.equal(ready({...f,rotors:[0,1,3],signal:true}),true);});
test('signal prefix handles errors and restarts without a queued victory',()=>{assert.deepEqual(tap(0,0),{step:1,correct:true});assert.deepEqual(tap(1,1),{step:0,correct:false});assert.deepEqual(tap(1,0),{step:1,correct:false});assert.equal(tap(tap(tap(0,0).step,2).step,1).step,3);});
test('scroll travel reverses and clamps while speed smoothing is refresh-rate independent',()=>{assert.equal(progress(-800,2600,1000),.5);assert.equal(progress(0,2600,1000),0);assert.equal(progress(-9999,2600,1000),1);let a=0,b=0;for(let i=1;i<=60;i++)a=velocity(a,i*1000/60,(i-1)*1000/60,1000,1/60).speed;for(let i=1;i<=120;i++)b=velocity(b,i*1000/120,(i-1)*1000/120,1000,1/120).speed;assert.ok(Math.abs(a-b)<.001);assert.equal(velocity(0,0,1000,1000,.01).direction,-1);});
test('cooldowns prevent threshold chatter without delaying events',()=>{const g=new Gate();assert.equal(g.allow('arrival',1,.8),true);assert.equal(g.allow('arrival',1.2,.8),false);assert.equal(g.allow('pad',1.2,.08),true);assert.equal(g.allow('arrival',1.9,.8),true);});
