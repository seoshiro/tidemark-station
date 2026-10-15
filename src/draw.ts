import {clamp,powered,type World} from './state.ts';
const TAU=Math.PI*2;
function poly(c:CanvasRenderingContext2D,p:number[][],fill:string,stroke?:string){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,fill:string){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fill();}
function line(c:CanvasRenderingContext2D,p:number[][],color:string,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function glow(c:CanvasRenderingContext2D,x:number,y:number,r:number,alpha=.35){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,`rgba(255,211,146,${alpha})`);g.addColorStop(.3,`rgba(236,187,117,${alpha*.38})`);g.addColorStop(1,'rgba(236,187,117,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function rock(c:CanvasRenderingContext2D,x:number,y:number,r:number,far=false){
 c.save();c.translate(x,y);const a=far?.6:1;c.globalAlpha=a;
 poly(c,[[-r,-r*.04],[-r*.5,-r*.24],[r*.34,-r*.19],[r,.05*r],[r*.62,r*.48],[-r*.2,r*.63],[-r*.77,r*.35]],'#163e43');
 poly(c,[[-r,-r*.04],[-r*.5,-r*.24],[r*.34,-r*.19],[r,.05*r],[r*.18,r*.2],[-r*.6,r*.17]],far?'#41645c':'#74947c','#9fb39a66');
 poly(c,[[r*.18,r*.2],[r,.05*r],[r*.62,r*.48],[-r*.2,r*.63]],'#0f3039');
 poly(c,[[-r,-r*.04],[-r*.6,r*.17],[r*.18,r*.2],[-r*.2,r*.63],[-r*.77,r*.35]],far?'#21494a':'#284e4d');
 for(let i=0;i<15;i++){const q=((i*19)%11)/11;c.fillStyle=i%3?'#779c7950':'#0b273d80';c.fillRect(-r*.8+q*r*1.35,r*(.17+(i%5)*.065),r*(.08+(i%3)*.065),Math.max(1,r*.008));}
 if(!far)for(let i=0;i<12;i++){const px=-r*.65+((i*37)%13)/13*r*1.35,py=-r*.06+((i*11)%7)/7*r*.12;line(c,[[px,py],[px-r*.015,py-r*.06],[px+r*.018,py-r*.018]],'#b8b68b99',1.5);}
 c.restore();
}
function tower(c:CanvasRenderingContext2D,x:number,y:number,s:number,lit:boolean,time:number){
 c.save();c.translate(x,y);c.scale(s,s);
 ellipse(c,14,7,83,20,'#051a2070');
 poly(c,[[-51,0],[-32,-238],[28,-250],[57,-8],[7,17]],'#b8c4a6','#d1d5b799');
 poly(c,[[7,17],[4,-239],[28,-250],[57,-8]],'#647d72');
 poly(c,[[-51,0],[-32,-238],[4,-239],[7,17]],'#d2d8b5');
 for(let i=0;i<9;i++)line(c,[[-46+i*.7,-17-i*25],[43-i*1.8,-23-i*25]],'#405d5a35',1);
 for(let i=0;i<7;i++){const xx=i%2?-22:-8,yy=-45-i*27;c.fillStyle='#61796d55';c.fillRect(xx,yy,10,3);}
 poly(c,[[-18,2],[-16,-49],[5,-52],[14,-3]],'#173941','#638a7a');c.fillStyle='#d9a36d';c.fillRect(-8,-30,6,10);
 for(const yy of [-89,-151,-207]){poly(c,[[-18,yy],[-17,yy-23],[0,yy-24],[1,yy]],'#173d43','#809c86');c.fillStyle='#deb07888';c.fillRect(-13,yy-19,5,13);}
 // Cantilevered gallery and copper roof: continuous surfaces, distinct materials.
 ellipse(c,0,-250,69,22,'#506f66');ellipse(c,0,-255,70,21,'#c4c7a3');
 for(let i=0;i<9;i++){const a=i*Math.PI/8;c.strokeStyle='#173c41';c.lineWidth=2;c.beginPath();c.moveTo(Math.cos(a)*64,-255+Math.sin(a)*16);c.lineTo(Math.cos(a)*64,-281+Math.sin(a)*16);c.stroke();}
 c.strokeStyle='#39594f';c.lineWidth=2;c.beginPath();c.ellipse(0,-281,65,18,0,0,Math.PI);c.stroke();
 poly(c,[[-38,-257],[-38,-330],[33,-330],[36,-258]],'#9bc2b033','#c0cfb5');
 for(const xx of [-38,-12,13,36])line(c,[[xx,-259],[xx,-330]],'#314f49',3);
 if(lit){glow(c,0,-292,130,.8);c.save();c.globalAlpha=.18;const angle=Math.sin(time*.18)*.16;const g=c.createLinearGradient(0,-292,500,-292);g.addColorStop(0,'#ffe4a8');g.addColorStop(1,'#ffe4a800');c.fillStyle=g;c.beginPath();c.moveTo(0,-293);c.lineTo(600,-350+angle*100);c.lineTo(600,-170+angle*100);c.closePath();c.fill();c.restore();}
 ellipse(c,0,-293,14,25,lit?'#fce6b2':'#b79865');ellipse(c,-3,-293,5,19,lit?'#fff6d4':'#e7bd7c');
 poly(c,[[-49,-329],[-15,-371],[15,-375],[50,-331]],'#bf9170','#d2b28d');poly(c,[[15,-375],[50,-331],[4,-338]],'#698478');line(c,[[-15,-371],[14,-375]],'#ecd1a4',2);line(c,[[2,-374],[2,-395]],'#d5ba8d',2);c.fillStyle='#e8c78e';c.fillRect(-1,-399,6,6);
 c.restore();
}
function lantern(c:CanvasRenderingContext2D,x:number,y:number,s:number,turn=0){c.save();c.translate(x,y);c.scale(s,s);c.rotate(turn);glow(c,0,0,65,.38);line(c,[[-10,-23],[-7,-33],[7,-33],[10,-23]],'#b69e79',2);poly(c,[[-14,-22],[13,-22],[18,20],[-18,20]],'#bed2af1c','#98b6a4');poly(c,[[-14,-22],[0,-29],[13,-22],[0,-17]],'#d4b187');poly(c,[[-18,20],[18,20],[10,27],[-10,27]],'#8c755c','#d2b187');ellipse(c,0,0,5,14,'#f0ce91');for(const a of [-1,1])line(c,[[a*10,-21],[a*13,20]],'#537267',2);c.restore();}
export function carrier(p:number,w:number,h:number){return{x:w*(.13+p*.74),y:h*(.53-Math.sin(p*Math.PI)*.13)};}
function workshop(c:CanvasRenderingContext2D,w:number,h:number,s:World,time:number){
 const scale=Math.min(w/900,h/440),p=s.motion?s.progress:.5;
 const far=c.createLinearGradient(0,0,0,h);far.addColorStop(0,'#163e4640');far.addColorStop(1,'#09202900');c.fillStyle=far;c.fillRect(0,0,w,h);
 for(let i=0;i<7;i++)line(c,[[w*.15+i*w*.14,0],[w*.05+i*w*.14,h]],'#81aaa009');
 const q=carrier(p,w,h),sag=clamp(Math.abs(s.velocity),0,3)*7;
 line(c,[[w*.08,h*.22],[w*.3,h*.1],[w*.56,h*.15],[w*.92,h*.18]],'#6b938259',1);
 c.strokeStyle='#c19466';c.lineWidth=2;c.beginPath();c.moveTo(w*.08,h*.22);c.quadraticCurveTo(q.x,h*.12+sag,q.x,q.y-20*scale);c.stroke();
 for(let i=0;i<3;i++){
  const x=w*(.15+i*.35),y=h*(.68-(i===1?.12:0)),r=73*scale;
  rock(c,x,y,r);c.save();c.translate(x,y-r*.08);c.scale(scale,scale);
  if(i===0){poly(c,[[-29,0],[-30,-70],[16,-82],[38,-15],[0,10]],'#294d50','#789585');poly(c,[[-30,-70],[16,-82],[27,-64],[-18,-54]],'#829579');for(let n=0;n<3;n++){c.save();c.translate(-1,-18-n*14);c.rotate(s.save.rotors[n]*Math.PI/2);c.strokeStyle=powered(s.save)?'#d9d39a':'#af825d';c.lineWidth=4;c.beginPath();c.ellipse(0,0,19,8,-.2,0,TAU);c.stroke();c.restore();}if(powered(s.save))glow(c,-3,-38,60,.25);}
  else if(i===1){poly(c,[[-34,0],[32,0],[24,-14],[-23,-19]],'#6f897a','#b3c3a2');c.save();c.translate(0,-53);c.rotate(-.25);const spread=10+Math.abs(s.save.lens-64)*.45;c.fillStyle='#e6c58c18';c.beginPath();c.moveTo(-70,-spread);c.lineTo(0,0);c.lineTo(-70,spread);c.closePath();c.fill();c.strokeStyle='#c5c5a1';c.lineWidth=7;c.beginPath();c.ellipse(0,0,20+s.save.lens*.125,39,0,0,TAU);c.stroke();ellipse(c,0,0,19,30,'#83bfb14a');line(c,[[-18,-7],[18,-7]],'#d2d5b755',1);line(c,[[-16,8],[16,8]],'#d2d5b755',1);if(s.save.focused)glow(c,0,0,75,.38);c.restore();}
  else{poly(c,[[-25,0],[-26,-42],[30,-36],[32,0]],'#456862','#8ba18b');for(let n=0;n<3;n++)ellipse(c,-13+n*15,-21,3.5,4,s.save.signal||n<s.signalStep?'#edc58a':'#8fb2a7');line(c,[[3,-41],[6,-92]],'#b8b593',3);c.save();c.translate(6,-94);c.rotate(-.4);c.strokeStyle='#adc5ad';c.lineWidth=4;c.beginPath();c.ellipse(0,0,24,8,0,0,Math.PI);c.stroke();c.restore();}
  line(c,[[-r/scale*.45,29],[r/scale*.45,29]],'#b6946c66',1);c.fillStyle='#a5bbaa';c.font='9px monospace';c.textAlign='center';c.fillText(['01 / POWER','02 / OPTICS','03 / SIGNAL'][i],0,54);c.restore();
 }
 const yy=q.y+(s.motion?Math.sin(time*.8)*3+s.impact:0);lantern(c,q.x,yy,Math.max(.55,scale*.9),s.motion?-s.velocity*.07:0);
 // Rail fragments in the near plane shift faster than the islands behind them.
 for(let i=0;i<5;i++){const x=w*(i*.24-.04)-(s.motion?s.pointer.x*10:0);poly(c,[[x,h*.93],[x+w*.12,h*.88],[x+w*.14,h],[x-w*.03,h]],'#153b42','#668a7444');}
}
function optics(c:CanvasRenderingContext2D,w:number,h:number,s:World,time:number){
 const x=w*.5,y=h*.49,r=Math.min(w,h)*.28,open=s.motion?s.opening:1;
 c.save();c.translate(x,y);const turn=s.motion?s.pointer.x*.025:0;c.rotate(turn);
 glow(c,0,0,r*1.9,.1+s.charge*.35);
 for(let ring=0;ring<8;ring++){c.strokeStyle=ring%2?'#88b8a84a':'#cfbd9260';c.lineWidth=ring%2?1:2;c.beginPath();c.ellipse(0,0,r*(.56+ring*.075),r*(.73+ring*.075),-.1,0,TAU);c.stroke();}
 for(let i=0;i<12;i++){const a=i*TAU/12;c.save();c.rotate(a);poly(c,[[r*1.05,-4],[r*1.21,-4],[r*1.21,4],[r*1.05,4]],'#a38b69');ellipse(c,r*1.14,0,2,2,'#e1c198');c.restore();}
 for(const side of [-1,1]){c.save();c.scale(side,1);poly(c,[[r*(.08+open*.8),-r*1.12],[r*(.7+open*.4),-r*.96],[r*(.9+open*.5),r*.92],[r*(.05+open*.8),r*1.15]],'#355a56','#b3b795');for(let k=0;k<5;k++)line(c,[[r*(.15+open*.8),r*(-.75+k*.32)],[r*(.73+open*.4),r*(-.66+k*.3)]],'#d2bb8d55',2);c.restore();}
 const beam=s.phase==='lit'?1:s.charge;
 if(beam>0){c.save();c.globalAlpha=.1+beam*.16;const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#ffdf9b');g.addColorStop(1,'#ffdf9b00');c.fillStyle=g;const sy=s.motion?Math.sin(time*.3)*r*.2:0;c.beginPath();c.moveTo(0,0);c.lineTo(w,sy-r*.65);c.lineTo(w,sy+r*.65);c.closePath();c.fill();c.restore();}
 ellipse(c,0,0,r*.3,r*.46,beam?'#f9dfac':'#a5bc9d');ellipse(c,-r*.05,0,r*.09,r*.3,beam?'#fff2cb':'#d7c69d');
 poly(c,[[-r*.68,r*1.6],[-r*.51,r*1.28],[r*.47,r*1.25],[r*.71,r*1.6]],'#54766a','#a5b596');line(c,[[0,r*1.1],[0,r*1.4]],'#a7aa86',4);c.restore();
}
export function draw(c:CanvasRenderingContext2D,w:number,h:number,s:World,kind:string,time:number,scroll:number){
 c.clearRect(0,0,w,h);const px=s.motion?s.pointer.x:0,py=s.motion?s.pointer.y:0;
 if(kind==='workshop'){c.save();c.translate(px*3,py*2);workshop(c,w,h,s,time);c.restore();return;}
 if(kind==='beacon'){optics(c,w,h,s,time);return;}
 if(kind==='journal'){c.strokeStyle='#355b4d1a';c.lineWidth=1;for(let i=0;i<8;i++){c.beginPath();c.ellipse(w*.56,h*.51,w*(.13+i*.05),h*(.12+i*.045),-.2,0,TAU);c.stroke();}line(c,[[w*.1,h*.6],[w*.3,h*.35],[w*.55,h*.65],[w*.85,h*.22]],'#567c6430',2);return;}
 const mobile=w<600,horizon=mobile?h*.63:h*.57;
 const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#31554e');sky.addColorStop(.42,'#345c57');sky.addColorStop(.66,'#193f47');sky.addColorStop(1,'#08232c');c.fillStyle=sky;c.fillRect(0,0,w,h);
 const drift=s.motion?scroll*.012:0;
 for(let i=0;i<6;i++){const x=w*((i*.287+.1)%1)+px*3,y=h*(.16+(i%3)*.06)+Math.sin(i)*10-drift*.08;poly(c,[[x-110,y],[x-50,y-18],[x+35,y-11],[x+88,y+3],[x+23,y+15],[x-60,y+9]],'#b4c7ae0d');}
 ellipse(c,w*.84+px*2,h*.17,Math.min(38,w*.035),Math.min(38,w*.035),'#c6d0ae21');
 c.fillStyle='#12353e';c.fillRect(0,horizon,w,h-horizon);
 rock(c,w*.16+px*4,horizon+20,w*.16,true);rock(c,w*.46+px*5,horizon-8,w*.1,true);rock(c,w*.95+px*5,horizon-5,w*.17,true);
 for(let i=0;i<25;i++){const y=horizon+(i/24)**1.5*(h-horizon),shift=s.motion?Math.sin(time*.4+i)*9+drift*.15:0;c.strokeStyle=i%3?'#77a89c23':'#bed0a928';c.lineWidth=i>16?2:1;c.beginPath();for(let n=0;n<12;n++){const x=n*w/11;c.lineTo(x,y+Math.sin(n*2.2+i+shift*.04)*(2+i*.16));}c.stroke();}
 const scale=mobile?.64:Math.min(w/1200,h/800)*1.08,cx=w*(mobile?.66:.73)+px*6,cy=h*(mobile?.82:.72)+py*3;
 rock(c,cx,cy+30*scale,310*scale);tower(c,cx+15*scale,cy+1*scale,scale,s.save.lit,time);
 // A timber walkway and its tensioned lantern cable lead into the workshop.
 const ax=cx-260*scale,ay=cy+90*scale,bx=cx-65*scale,by=cy+23*scale;
 poly(c,[[ax,ay],[bx,by],[bx+35*scale,by+8*scale],[ax+30*scale,ay+17*scale]],'#826d50','#b69d76');
 for(let i=0;i<12;i++){const p=i/11;line(c,[[ax+(bx-ax)*p,ay+(by-ay)*p],[ax+(bx-ax)*p+30*scale,ay+(by-ay)*p+15*scale]],'#1b393c80',2);}
 for(const p of [0,.5,1])line(c,[[ax+(bx-ax)*p,ay+(by-ay)*p],[ax+(bx-ax)*p-3*scale,ay+(by-ay)*p-42*scale]],'#b9b290',3);
 line(c,[[ax-3*scale,ay-42*scale],[bx-3*scale,by-42*scale]],'#c5b48d',1);
 const lx=cx-170*scale,ly=cy+17*scale+(s.motion?Math.sin(time)*3-s.velocity*2:0);line(c,[[lx,ly-70*scale],[lx,ly-28*scale]],'#b9a981',1.5);lantern(c,lx,ly,.7*scale,s.motion?s.velocity*.04:0);
 rock(c,-w*.06,h*.99,w*.3);rock(c,w*1.04,h*1.05,w*.22);
}
