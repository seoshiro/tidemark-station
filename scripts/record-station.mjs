import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
await mkdir('evidence/v2/final',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'no-preference'});
await page.addInitScript(()=>{
 sessionStorage.setItem('tidemark-entry','seen');window.__audio={contexts:[],analyser:null,stream:null};const Native=window.AudioContext;
 window.AudioContext=class extends Native{
  constructor(...args){super(...args);window.__audio.contexts.push(this);}
  createGain(){const node=super.createGain(),connect=node.connect.bind(node),context=this;node.connect=function(destination,...args){const result=connect(destination,...args);if(destination===context.destination&&!window.__audio.analyser){const analyser=context.createAnalyser();analyser.fftSize=2048;const stream=context.createMediaStreamDestination();connect(analyser);connect(stream);window.__audio.analyser=analyser;window.__audio.stream=stream.stream;}return result;};return node;}
 };
});
const cdp=await page.context().newCDPSession(page);let pending=false,frames=0;const levels=[];
const level=()=>page.evaluate(()=>{const a=window.__audio,b=new Float32Array(a.analyser.fftSize);a.analyser.getFloatTimeDomainData(b);return{rms:Math.sqrt(b.reduce((s,v)=>s+v*v,0)/b.length),contexts:a.contexts.length,state:a.contexts[0].state,wind:Number(document.body.dataset.wind),music:Number(document.body.dataset.music),voices:Number(document.body.dataset.audioVoices)};});
try{
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:5324/tidemark-station/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.locator('.settings summary').click();await page.locator('.sound-toggle').click();await page.locator('.settings summary').click();await page.waitForTimeout(1000);
 const initial=await level();if(initial.state!=='running'||initial.rms<=.00001)throw new Error('Actual post-master audio unavailable');
 await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=900;const ctx=canvas.getContext('2d'),stream=canvas.captureStream(24);for(const track of window.__audio.stream.getAudioTracks())stream.addTrack(track);const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')?'video/webm;codecs=vp9,opus':'video/webm',recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1500000,audioBitsPerSecond:96000}),chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};window.__recording={canvas,ctx,recorder,chunks,mime};recorder.start(250);});
 cdp.on('Page.screencastFrame',async e=>{await cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId});if(pending)return;pending=true;try{await page.evaluate(async data=>{const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0)),image=await createImageBitmap(new Blob([bytes],{type:'image/jpeg'})),r=window.__recording;r.ctx.drawImage(image,0,0,r.canvas.width,r.canvas.height);image.close();},e.data);frames++;}catch{/* Last frame may be discarded at stop. */}finally{pending=false;}});
 await cdp.send('Page.startScreencast',{format:'jpeg',quality:80,maxWidth:1280,maxHeight:900,everyNthFrame:2});
 await page.waitForTimeout(700);await page.locator('[data-chest="coil"]').click();await page.waitForTimeout(420);await page.screenshot({path:'evidence/v2/final/coil-in-flight-1280.png'});await page.waitForTimeout(650);await page.locator('.shore .button').click();await page.waitForTimeout(1100);
 for(let i=0;i<16;i++){await page.mouse.wheel(0,58);await page.waitForTimeout(90);if(i%4===0)levels.push(await level());}
 for(let i=0;i<9;i++){await page.mouse.wheel(0,-52);await page.waitForTimeout(100);}
 await page.locator('[data-chest="prism"]').click();await page.waitForTimeout(1050);for(const i of [0,1,2,2]){await page.locator(`[data-rotor="${i}"]`).click();await page.waitForTimeout(230);}
 await page.locator('#lens').fill('64');await page.waitForTimeout(350);await page.locator('[data-focus]').click();await page.waitForTimeout(500);for(const i of [0,2,1]){await page.locator(`[data-pad="${i}"]`).click();await page.waitForTimeout(300);}
 await page.locator('[data-chest="chart"]').click();await page.waitForTimeout(1050);await page.locator('.journal-open').click();await page.waitForTimeout(700);await page.locator('.journal-dialog .note-next').click();await page.waitForTimeout(600);await page.keyboard.press('Escape');
 await page.locator('#beacon').evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top,behavior:'smooth'}));await page.waitForTimeout(1100);await page.locator('.ignite').click();await page.waitForTimeout(950);levels.push(await level());await page.waitForTimeout(1700);await page.screenshot({path:'evidence/v2/final/beacon-lit-1280.png'});
 await cdp.send('Page.stopScreencast');
 const video=await page.evaluate(()=>new Promise(resolve=>{const r=window.__recording;r.recorder.onstop=async()=>{const blob=new Blob(r.chunks,{type:r.mime});resolve({bytes:Array.from(new Uint8Array(await blob.arrayBuffer())),mime:r.mime,videoTracks:r.recorder.stream.getVideoTracks().length,audioTracks:r.recorder.stream.getAudioTracks().length});};r.recorder.stop();}));
 await writeFile('evidence/v2/final/tidemark-voxel-with-audio.webm',Buffer.from(video.bytes));
 const sync=await page.evaluate(()=>Math.abs(Number(document.body.dataset.audioContact)-Number(document.querySelector('#beacon').dataset.contact)));const assets=await page.locator('script[src],link[rel=stylesheet]').evaluateAll(els=>els.map(e=>e.getAttribute('src')||e.getAttribute('href')));const meta={activationSyncMs:sync,assets,frames,bytes:video.bytes.length,mime:video.mime,videoTracks:video.videoTracks,audioTracks:video.audioTracks,source:'Actual Chrome screencast frames + actual post-master Web Audio. No replacement soundtrack.',levels:[initial,...levels],auditoryAssessment:'NOT TESTED'};
 await writeFile('evidence/v2/final/recording.json',JSON.stringify(meta,null,2));console.log(JSON.stringify(meta));
}finally{await browser.close();}
