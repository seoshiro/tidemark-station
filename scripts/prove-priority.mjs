// Controlled before/after regression of our own audio implementation.
// Always restore source and rebuild, including when the expected failure differs.
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const path='src/audio.ts',fixed=readFileSync(path,'utf8');
const branch="  if(key==='activate'&&!afterCancel){cancel();const token=revision;priorityTimer=window.setTimeout(()=>{if(token===revision)event(key,pad,true);},100);return;}";
if(!fixed.includes(branch))throw new Error('Expected source guard not found');
const run=(args)=>spawnSync(process.execPath,args,{encoding:'utf8'});
const build=()=>{const r=run(['node_modules/vite/bin/vite.js','build']);if(r.status!==0)throw new Error(r.stderr||r.stdout);};
let before,after;
try{writeFileSync(path,fixed.replace(branch,'').replace('  const pitches=','  if(key===\'activate\')cancel();const pitches='));build();before=run(['node_modules/@playwright/test/cli.js','test','--grep','rapid repeated clicks']);}
finally{writeFileSync(path,fixed);build();}
after=run(['node_modules/@playwright/test/cli.js','test','--grep','rapid repeated clicks']);
writeFileSync('evidence/priority-before-after.json',JSON.stringify({before:{exit:before?.status,output:before?.stdout},after:{exit:after.status,output:after.stdout},sourceRestored:readFileSync(path,'utf8')===fixed},null,2));
if(before?.status!==1||after.status!==0)throw new Error('Before/after regression did not match expected failure/pass');console.log('Before: priority accent dropped; after: 3 active climax voices; source restored.');
