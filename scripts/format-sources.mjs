import ts from 'typescript';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
const files=['vite.config.ts','playwright.config.ts'];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())walk(p);else if(p.endsWith('.ts'))files.push(p);}}walk('src');walk('tests');
const printer=ts.createPrinter({newLine:ts.NewLineKind.LineFeed});
for(const file of files){const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);if(source.parseDiagnostics.length)throw new Error('Parse error in '+file);writeFileSync(file,printer.printFile(source));}
console.log(`Formatted ${files.length} TypeScript sources with the existing TypeScript printer.`);
