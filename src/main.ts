import './style.css';
import {copy,type Locale} from './copy.ts';
import {restore,fresh,powered,ready,count,rotate,focus,tap,targets,clamp,progress,velocity,type World} from './state.ts';
import {draw,carrier} from './draw.ts';
import {createAudio} from './audio.ts';
const get=(key:string,session=false)=>{try{return(session?sessionStorage:localStorage).getItem(key);}catch{return null;}};
const put=(key:string,value:string,session=false)=>{try{(session?sessionStorage:localStorage).setItem(key,value);}catch{/* Optional persistence, never required to play. */}};
let locale:Locale=['ru','en','kk'].includes(get('tidemark-language')||'')?get('tidemark-language') as Locale:'ru';
const saved=restore(get('tidemark-save-v1')),storedVolume=Number(get('tidemark-volume')??.35),world:World={active:'shore',progress:0,velocity:0,direction:0,pointer:{x:0,y:0},opening:0,charge:saved.lit?1:0,phase:saved.lit?'lit':'waiting',save:saved,motion:true,hidden:false,sound:false,volume:Number.isFinite(storedVolume)?clamp(storedVolume):.35,signalStep:0,impact:0};
let paused=get('tidemark-motion')==='off',note=0,lastY=scrollY,last=0,elapsed=0,frame=0,lastDraw=0,previousStep=-1,activationTime=0,accent=false,impactVelocity=0,keyNear=false,dead=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:900px)'),mission=document.querySelector<HTMLElement>('.mission')!,beacon=document.querySelector<HTMLElement>('.beacon')!,journal=document.querySelector<HTMLElement>('.journal')!;
const boot=document.querySelector<HTMLDialogElement>('.boot')!,book=document.querySelector<HTMLDialogElement>('.journal-dialog')!,lens=document.querySelector<HTMLInputElement>('#lens')!,volume=document.querySelector<HTMLInputElement>('#volume')!,ignite=document.querySelector<HTMLButtonElement>('.ignite')!;
const audio=createAudio(world,failed=>{soundUI(failed);request();});
const controller=new AbortController(),options={signal:controller.signal};
const surfaces=[...document.querySelectorAll<HTMLCanvasElement>('canvas[data-scene]')].map(canvas=>({canvas,ctx:canvas.getContext('2d'),w:0,h:0,visible:false}));
const allowed=()=>!paused&&!reduced.matches;
const persist=()=>put('tidemark-save-v1',JSON.stringify(world.save));
const text=(selector:string,value:string)=>{for(const el of document.querySelectorAll<HTMLElement>(selector))el.textContent=value;};
function lines(el:HTMLElement,value:string){el.replaceChildren(...value.split('\n').flatMap((part,i)=>i?[document.createElement('br'),document.createTextNode(part)]:[document.createTextNode(part)]));}
function soundUI(failed=false){const c=copy[locale];text('.sound-toggle',world.sound?c.soundOn:c.soundOff);document.querySelector('.sound-toggle')!.setAttribute('aria-pressed',String(world.sound));document.body.dataset.sound=world.sound?'on':'off';text('.audio-status',failed?c.audioError:'');}
function noteUI(){const c=copy[locale],entry=c.notes[note];text('.note-title,#dialog-note-title',entry[0]);text('.note-body,.dialog-note-body',entry[1]);text('.note-number',`${String(note+1).padStart(2,'0')} / 03`);for(const el of document.querySelectorAll<HTMLButtonElement>('.note-prev')){el.disabled=note===0;el.setAttribute('aria-label',c.previous);}for(const el of document.querySelectorAll<HTMLButtonElement>('.note-next')){el.disabled=note===2;el.setAttribute('aria-label',c.next);}}
function render(){
 const c=copy[locale];document.documentElement.lang=locale;
 for(const el of document.querySelectorAll<HTMLElement>('[data-copy]')){const key=el.dataset.copy as keyof typeof c;if(typeof c[key]==='string')el.textContent=c[key] as string;}
 for(const el of document.querySelectorAll<HTMLElement>('[data-lines]'))lines(el,c[el.dataset.lines as 'heroTitle']);
 for(const [i,el]of [...document.querySelectorAll<HTMLElement>('[data-nav]')].entries())el.textContent=c.nav[i];
 for(const el of document.querySelectorAll<HTMLButtonElement>('[data-lang]'))el.setAttribute('aria-pressed',String(el.dataset.lang===locale));
 document.querySelector('.journal-close')!.setAttribute('aria-label',c.close);document.querySelector('nav')!.setAttribute('aria-label',c.nav.join(', '));document.querySelector('.rotors')!.setAttribute('aria-label',c.power);document.querySelector('.pads')!.setAttribute('aria-label',c.signalText);document.querySelector('.completion')!.setAttribute('aria-label',c.status);
 for(const [i,el]of [...document.querySelectorAll<HTMLButtonElement>('[data-rotor]')].entries()){el.style.setProperty('--target',`${targets[i]*90}deg`);el.style.setProperty('--turn',`${world.save.rotors[i]*90}deg`);el.disabled=powered(world.save);el.setAttribute('aria-label',`${c.rotor} ${i+1}: ${world.save.rotors[i]*90}°`);}
 lens.value=String(world.save.lens);lens.disabled=world.save.focused;text('.lens-value',String(world.save.lens));document.querySelector<HTMLButtonElement>('[data-focus]')!.disabled=world.save.focused;
 const complete=[powered(world.save),world.save.focused,world.save.signal];for(const [i,el]of [...document.querySelectorAll<HTMLElement>('.mechanism')].entries())el.classList.toggle('is-done',complete[i]);
 for(const [i,el]of [...document.querySelectorAll<HTMLElement>('[data-complete]')].entries())el.classList.toggle('ready',complete[i]);
 text('[data-status="power"]',complete[0]?'✓ '+c.powerDone:'◇');text('[data-status="lens"]',complete[1]?'✓ '+c.focusDone:'◇');text('[data-status="signal"]',complete[2]?'✓ '+c.signalDone:`${world.signalStep} / 3`);text('.task-count',`${count(world.save)} / 3`);
 for(const el of document.querySelectorAll<HTMLButtonElement>('[data-pad]')){el.disabled=world.save.signal;el.setAttribute('aria-label',`${c.signal}: ${Number(el.dataset.pad)+1}`);}
 ignite.disabled=!ready(world.save)||world.phase!=='waiting';text('.ignite>span:first-child',world.phase==='charging'?c.charging:world.phase==='lit'?c.litStatus:c.activate);text('.beacon-status',world.phase==='charging'?c.charging:world.phase==='lit'?c.litStatus:ready(world.save)?c.ready:c.missing);
 lines(document.querySelector<HTMLElement>('.final-title')!,world.save.lit?c.litTitle:c.finalTitle);text('.final-text',world.save.lit?c.litText:c.finalText);beacon.dataset.phase=world.phase;
 document.documentElement.classList.toggle('reduced',!allowed());text('.motion-toggle',allowed()?c.motionOn:c.motionOff);document.querySelector('.motion-toggle')!.setAttribute('aria-pressed',String(!allowed()));volume.value=String(Math.round(world.volume*100));soundUI();noteUI();request();
}
function resize(){for(const surface of surfaces){const r=surface.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);surface.w=r.width;surface.h=r.height;surface.canvas.width=Math.round(r.width*dpr);surface.canvas.height=Math.round(r.height*dpr);surface.ctx?.setTransform(dpr,0,0,dpr,0,0);}request();}
function request(){if(!frame&&!dead&&!document.hidden)frame=requestAnimationFrame(tick);}
function tick(now:number){
 frame=0;const actual=last?Math.max(.001,(now-last)/1000):1/60,dt=Math.min(.05,actual);last=now;elapsed+=dt;world.motion=allowed();world.hidden=false;
 const sample=velocity(world.velocity,scrollY,lastY,innerHeight,actual);world.velocity=Math.abs(sample.speed)<.001?0:sample.speed;world.direction=sample.direction;lastY=scrollY;
 const mr=mission.getBoundingClientRect(),br=beacon.getBoundingClientRect(),jr=journal.getBoundingClientRect();world.progress=!narrow.matches&&allowed()?progress(mr.top,mr.height,innerHeight):clamp((innerHeight*.65-mr.top)/(mr.height-innerHeight*.1));world.opening=clamp((innerHeight*.9-br.top)/(innerHeight*.85));world.active=mr.top<innerHeight&&mr.bottom>0?'workshop':br.top<innerHeight&&br.bottom>0?'beacon':jr.top<innerHeight&&jr.bottom>0?'journal':'shore';
 const step=Math.round(world.progress*2);if(step!==previousStep){for(const [i,el]of [...document.querySelectorAll<HTMLElement>('.mechanism')].entries()){el.classList.toggle('is-current',i===step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');}if(previousStep>=0&&world.active==='workshop'){impactVelocity=24;audio.event('arrival');}previousStep=step;}
 mission.style.setProperty('--progress',String(world.progress));mission.dataset.progress=world.progress.toFixed(3);text('.travel-percent',`${String(Math.round(world.progress*100)).padStart(3,'0')}%`);journal.style.setProperty('--book-open',String(clamp((innerHeight-jr.top)/innerHeight)));
 if(world.phase==='charging'){activationTime+=dt;world.charge=clamp(activationTime/1.4);if(activationTime>.6&&!accent){accent=true;audio.event('activate');impactVelocity=55;}if(activationTime>=1.8){world.phase='lit';world.save={...world.save,lit:true};world.charge=1;audio.duck(false);persist();render();}}
 impactVelocity+=(-world.impact*65-impactVelocity*11)*dt;world.impact+=impactVelocity*dt;if(!allowed())world.impact=impactVelocity=0;
 const active=surfaces.find(s=>s.visible&&s.canvas.dataset.scene===world.active),r=active?.canvas.getBoundingClientRect(),point=r?world.active==='workshop'?carrier(world.progress,r.width,r.height):{x:r.width*.5,y:r.height*.5}:null;
 const near=keyNear?.65:r&&point?clamp(1-Math.hypot((world.pointer.x+1)*innerWidth/2-r.left-point.x,(world.pointer.y+1)*innerHeight/2-r.top-point.y)/170):0;audio.update(near);
 if(now-lastDraw>30||!allowed()){for(const s of surfaces)if(s.visible&&s.ctx)draw(s.ctx,s.w,s.h,world,s.canvas.dataset.scene!,allowed()?elapsed:0,scrollY);lastDraw=now;}
 if(import.meta.env.DEV&&new URLSearchParams(location.search).has('telemetry')){const d=document.querySelector<HTMLOutputElement>('.telemetry')!;d.hidden=false;d.textContent=`${world.active} p:${world.progress.toFixed(2)} v:${world.velocity.toFixed(2)} ${world.phase}`;}
 if(world.phase==='charging'||Math.abs(world.velocity)>.001||allowed()&&surfaces.some(s=>s.visible))request();else last=0;
}
const sizer=new ResizeObserver(resize);for(const s of surfaces)sizer.observe(s.canvas);
const observer=new IntersectionObserver(entries=>{for(const entry of entries){const surface=surfaces.find(s=>s.canvas===entry.target);if(surface)surface.visible=entry.isIntersecting;}request();},{rootMargin:'80px'});for(const s of surfaces)observer.observe(s.canvas);
document.documentElement.classList.add('js');render();resize();
function entrance(sound:boolean){if(!boot.open)return;if(sound)void audio.set(true);put('tidemark-entry','seen',true);boot.classList.add('is-leaving');window.setTimeout(()=>{boot.close();document.querySelector<HTMLElement>('#main')?.focus({preventScroll:true});request();},allowed()?390:0);}
if(!get('tidemark-entry',true)){boot.showModal();boot.querySelector<HTMLButtonElement>('[data-enter="silent"]')!.focus({preventScroll:true});}const safety=window.setTimeout(()=>entrance(false),6500);
boot.addEventListener('cancel',event=>{event.preventDefault();entrance(false);},options);
document.addEventListener('click',event=>{
 const target=event.target as HTMLElement;
 const enter=target.closest<HTMLElement>('[data-enter]');if(enter){clearTimeout(safety);entrance(enter.dataset.enter==='sound');}
 const language=target.closest<HTMLElement>('[data-lang]');if(language){locale=language.dataset.lang as Locale;put('tidemark-language',locale);render();}
 if(target.closest('.sound-toggle'))audio.toggle();
 if(target.closest('.motion-toggle')){paused=!paused;put('tidemark-motion',paused?'off':'on');render();}
 const rotor=target.closest<HTMLButtonElement>('[data-rotor]');if(rotor&&!rotor.disabled){const next=rotate(world.save,Number(rotor.dataset.rotor));world.save=next;audio.event('rotate');impactVelocity=20;if(powered(next))audio.event('complete');persist();render();}
 if(target.closest('[data-focus]')&&!world.save.focused){const next=focus(world.save);if(next===world.save){text('[data-status="lens"]',copy[locale].focusHint);audio.event('error');}else{world.save=next;audio.event('complete');persist();render();}}
 const pad=target.closest<HTMLButtonElement>('[data-pad]');if(pad&&!pad.disabled){const value=Number(pad.dataset.pad),result=tap(world.signalStep,value);world.signalStep=result.step;pad.classList.remove('is-hit');void pad.offsetWidth;pad.classList.add('is-hit');audio.event(result.correct?'pad':'error',value);if(world.signalStep===3){world.save={...world.save,signal:true};audio.event('complete');persist();}render();if(!result.correct)text('[data-status="signal"]',copy[locale].wrong);}
 if(target.closest('.ignite')&&!ignite.disabled){world.phase='charging';activationTime=0;accent=false;audio.duck(true);render();}
 if(target.closest('.reset')){world.save=fresh();world.signalStep=0;world.phase='waiting';world.charge=0;activationTime=0;accent=false;audio.cancel();audio.duck(false);persist();render();}
 const next=target.closest('.note-next'),prev=target.closest('.note-prev');if(next||prev){note=clamp(note+(next?1:-1),0,2);noteUI();audio.event('paper');const card=document.querySelector('.log-card')!;card.classList.remove('is-turning');void (card as HTMLElement).offsetWidth;card.classList.add('is-turning');}
 if(target.closest('.journal-open')){noteUI();book.showModal();audio.event('paper');}
 if(target.closest('.journal-close'))book.close();
},options);
lens.addEventListener('input',()=>{world.save={...world.save,lens:Number(lens.value)};text('.lens-value',lens.value);persist();request();},options);
volume.addEventListener('input',()=>{audio.volume(Number(volume.value)/100);put('tidemark-volume',String(world.volume));request();},options);
document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;world.pointer={x:event.clientX/innerWidth*2-1,y:event.clientY/innerHeight*2-1};request();},{...options,passive:true});
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)world.pointer={x:0,y:0};},options);
document.addEventListener('focusin',event=>{keyNear=!!(event.target as HTMLElement).closest('.rotor,.pads button,[data-focus],.ignite')?.matches(':focus-visible');request();},options);document.addEventListener('focusout',()=>{keyNear=false;},options);
window.addEventListener('scroll',request,{...options,passive:true});reduced.addEventListener('change',render,options);narrow.addEventListener('change',request,options);
document.addEventListener('visibilitychange',()=>{world.hidden=document.hidden;cancelAnimationFrame(frame);frame=0;last=0;lastY=scrollY;world.velocity=0;if(!document.hidden)request();},options);
window.addEventListener('pagehide',event=>{if(event.persisted)return;dead=true;controller.abort();sizer.disconnect();observer.disconnect();cancelAnimationFrame(frame);clearTimeout(safety);audio.dispose();},{once:true});
