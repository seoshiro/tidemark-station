import {Gate,clamp,type World} from './state.ts';
export function createAudio(world:World,onChange:(failed?:boolean)=>void){
 let context:AudioContext|null=null,master:GainNode|null=null,music:GainNode|null=null,ambience:GainNode|null=null,sfx:GainNode|null=null,filter:BiquadFilterNode|null=null,panner:StereoPannerNode|null=null,noise:AudioBuffer|null=null,air:AudioBufferSourceNode|null=null;
 const drones:OscillatorNode[]=[],voices=new Set<{source:OscillatorNode|AudioBufferSourceNode;gain:GainNode}>(),gate=new Gate();let wanted=false,revision=0,dead=false,ducked=false,suspendTimer=0,priorityTimer=0,variation=0;
 const controller=new AbortController();
 const suspend=()=>{if(context&&context.state!=='closed')void context.suspend().catch(()=>{});};
 const fade=(value:number,tau=.18)=>{if(!context||!master)return;master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(value,context.currentTime,tau);};
 function init(){
  context=new AudioContext();master=context.createGain();music=context.createGain();ambience=context.createGain();sfx=context.createGain();master.gain.value=0;music.gain.value=.45;ambience.gain.value=0;sfx.gain.value=1;music.connect(master);ambience.connect(master);sfx.connect(master);master.connect(context.destination);
  for(const [i,hz]of [146.832,220,293.665].entries()){const node=context.createOscillator(),envelope=context.createGain();node.type=i===1?'triangle':'sine';node.frequency.value=hz;node.detune.value=i===2?-3:0;envelope.gain.value=i===1?.014:.024;node.connect(envelope);envelope.connect(music);node.start();drones.push(node);}
  noise=context.createBuffer(1,context.sampleRate*3,context.sampleRate);const data=noise.getChannelData(0);let seed=72917,brown=0;for(let i=0;i<data.length;i++){seed=seed*16807%2147483647;const white=seed/2147483647*2-1;brown=(brown+white*.025)/1.025;data[i]=brown*2+white*.14;}
  air=context.createBufferSource();air.buffer=noise;air.loop=true;filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=380;filter.Q.value=.4;panner=context.createStereoPanner();air.connect(filter);filter.connect(panner);panner.connect(ambience);air.start();
 }
 async function set(enabled:boolean){if(dead||wanted===enabled)return;wanted=enabled;world.sound=wanted;const token=++revision;clearTimeout(suspendTimer);onChange();if(!wanted){cancel();fade(0,.13);suspendTimer=window.setTimeout(()=>{if(!wanted)suspend();},750);return;}
  try{if(!context)init();await context!.resume();if(dead||token!==revision||!wanted)return;if(document.hidden){fade(0);suspend();}else fade(world.volume,.32);}catch{if(dead||token!==revision)return;wanted=false;world.sound=false;fade(0);suspend();onChange(true);}
 }
 function cancel(){clearTimeout(priorityTimer);if(!context)return;const now=context.currentTime;for(const voice of voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.012);try{voice.source.stop(now+.07);}catch{/* Already finished. */}}}
 function event(key:string,pad=0,afterCancel=false){
  if(!wanted||!context||context.state!=='running'||document.hidden||!sfx||!noise)return;
  // Let the outgoing envelopes end before reserving the three-note climax.
  // Reset, mute and visibility cancellation also cancel this pending accent.
  if(key==='activate'&&!afterCancel){cancel();const token=revision;priorityTimer=window.setTimeout(()=>{if(token===revision)event(key,pad,true);},100);return;}
  const now=context.currentTime;if(!gate.allow(key,now,key==='rotate'?.08:key==='pad'?.09:key==='activate'?2:key==='arrival'?.85:.22))return;
  const pitches=key==='activate'?[130.81,196,261.63]:key==='complete'?[659.25,987.77]:key==='pad'?[[329.63,493.88,392][pad]]:key==='error'?[130]:key==='arrival'?[196]:[196+(variation++%3)*9];
  if(voices.size+pitches.length>4)return;
  for(const [i,hz]of pitches.entries()){
   const paper=key==='paper',source=paper?context.createBufferSource():context.createOscillator(),gain=context.createGain(),start=now+i*.045,duration=key==='activate'?1.35:key==='complete'?.6:paper?.18:key==='rotate'?.16:.27;
   if(source instanceof AudioBufferSourceNode){source.buffer=noise;}else{source.type=key==='rotate'?'triangle':'sine';source.frequency.setValueAtTime(hz,start);if(key==='rotate'||key==='error')source.frequency.exponentialRampToValueAtTime(hz*.48,start+duration);}
   gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(paper?.15:key==='activate'?.06:.055,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);source.connect(gain);gain.connect(sfx);const voice={source,gain};voices.add(voice);source.onended=()=>{voices.delete(voice);source.disconnect();gain.disconnect();};if(source instanceof AudioBufferSourceNode)source.start(start,(variation++%10)*.17);else source.start(start);source.stop(start+duration+.02);
  }
 }
 function visibility(){if(dead)return;clearTimeout(suspendTimer);if(!context)return;if(document.hidden||!wanted){fade(0);cancel();suspend();}else{const token=revision;void context.resume().then(()=>{if(!dead&&wanted&&token===revision&&!document.hidden)fade(world.volume,.3);}).catch(()=>{if(!dead&&token===revision){wanted=false;world.sound=false;onChange(true);}});}}
 document.addEventListener('visibilitychange',visibility,{signal:controller.signal});
 return{set,toggle(){void set(!wanted);},event,cancel,duck(value:boolean){ducked=value;if(context&&music){music.gain.cancelScheduledValues(context.currentTime);music.gain.setTargetAtTime(value?.09:.45,context.currentTime,value?.15:.55);}},volume(value:number){world.volume=clamp(value);if(wanted&&!document.hidden)fade(world.volume,.1);},update(proximity:number){if(!context||!ambience||!filter||!panner)return;const t=context.currentTime,speed=clamp(Math.abs(world.velocity)/2.5),level=(.025+speed*.23+proximity*.025)*(ducked?.22:1);ambience.gain.setTargetAtTime(wanted&&!document.hidden?level:0,t,speed>.05?.09:.42);filter.frequency.setTargetAtTime(240+speed*1400+proximity*150,t,.14);panner.pan.setTargetAtTime(world.pointer.x*.2,t,.25);document.body.dataset.audioContexts='1';document.body.dataset.audioVoices=String(voices.size);document.body.dataset.audioState=context.state;document.body.dataset.wind=ambience.gain.value.toFixed(4);document.body.dataset.music=music!.gain.value.toFixed(4);},dispose(){dead=true;revision++;controller.abort();clearTimeout(suspendTimer);cancel();for(const node of drones)node.stop();air?.stop();if(context)void context.close().catch(()=>{});}};
}
