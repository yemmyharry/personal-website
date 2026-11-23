import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import {roles,projects} from '../content/portfolio.mjs';
const root=resolve(import.meta.dirname,'..');
const pages=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||['assets','docs','node_modules'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.html')&&!e.name.startsWith('google'))pages.push(p);}}
await walk(root);
let links=0;
for(const path of pages){const html=await readFile(path,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${path}: one h1`);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${path}: unique ids`);assert.match(html,/<link rel="canonical"/);for(const m of html.matchAll(/(?:href|src)="([^\"]+)"/g)){const u=m[1].replaceAll('&amp;','&');if(/^(https?:|data:|mailto:)/.test(u))continue;const [part,hash]=u.split('#');const clean=part.split('?')[0];let target=clean?resolve(clean.startsWith('/')?root:dirname(path),clean.replace(/^\//,'')):path;try{if((await stat(target)).isDirectory())target=resolve(target,'index.html');await stat(target);}catch{assert.fail(`${path}: missing link ${u}`);}if(hash){const linked=await readFile(target,'utf8');assert.ok(linked.includes(`id="${hash}"`),`${path}: missing fragment ${u}`);}links++;}}
for(const [r,config] of Object.entries(roles)){const html=await readFile(resolve(root,'.'+config.path,'index.html'),'utf8');for(const id of config.projects)assert.ok(html.includes(`${config.path}work/${id}/`));if(r!=='all'){assert.ok(html.includes('Full portfolio'));assert.ok(!html.includes('class="perspectives'));assert.ok(!html.includes('href="/work/'));}if(r==='frontend'){assert.ok(html.includes('data-ui-state'));assert.ok(!html.includes('id="opensource"'));}if(r==='backend'){assert.ok(!html.includes('id="opensource"'));assert.ok(!html.includes('id="writing"'));assert.ok(html.includes('Performanta'));assert.ok(html.includes('Secured Space'));}}
assert.equal(roles.fullstack,undefined);
assert.equal(projects.celltek,undefined);
assert.equal(projects.pressplay,undefined);
assert.deepEqual(roles.frontend.projects,['clooza','performanta','ipile']);
for(const path of pages){
 const html=await readFile(path,'utf8');
 assert.ok(!/Lagos|BASED IN LAGOS|a software engineer in Lagos/i.test(html),`${path}: no personal location`);
 assert.ok(!html.includes('Celltek Clinic')&&!html.includes('Press Play'),`${path}: only curated projects`);
 const artCount=(html.match(/class="project-art /g)||[]).length;
 assert.equal((html.match(/class="art-notes"/g)||[]).length,artCount,`${path}: captions use flow layout`);
}

await assert.rejects(stat(resolve(root,'fullstack/index.html')));
const payContext={window:{}};vm.runInNewContext(await readFile(resolve(root,'payment-lab.js'),'utf8'),payContext);const lab=payContext.window.PaymentLab;let state={...lab.initial(),id:'p1',status:'pending'};let result=lab.reduce(state,{version:2,status:'succeeded'});assert.equal(result.recorded,true);state=result.state;result=lab.reduce(state,{version:1,status:'pending'});assert.equal(result.outcome,'stale');assert.equal(result.state.status,'succeeded');assert.equal(lab.reduce(state,{version:3,status:'succeeded'}).recorded,false);assert.equal(lab.reduce(state,{version:4,status:'failed'}).outcome,'rejected');state={...lab.initial(),id:'p2',status:'pending'};state=lab.reduce(state,{version:1,status:'failed'}).state;assert.equal(lab.reduce(state,{version:2,status:'succeeded'}).recorded,true);
const analytics=await readFile(resolve(root,'analytics.js'),'utf8');
function environment(config={}){const storage=new Map(),scripts=[],events=[];const sandbox={window:{PORTFOLIO_ANALYTICS:config,umami:{track:(...args)=>events.push(args)}},navigator:{},location:{hostname:'yemmyharry.is-a.dev',origin:'https://yemmyharry.is-a.dev',pathname:'/frontend/',href:'https://yemmyharry.is-a.dev/frontend/'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},URL,URLSearchParams,document:{body:{dataset:{role:'frontend'}},getElementById:()=>null,createElement:()=>({dataset:{}}),head:{append:s=>scripts.push(s)},addEventListener:()=>{}}};vm.runInNewContext(analytics,sandbox);return {sandbox,storage,scripts,events};}
let env=environment();assert.equal(env.scripts.length,0,'Unconfigured analytics sends nothing');env=environment({websiteId:'public-id',scriptUrl:'https://cloud.umami.is/script.js',domains:['yemmyharry.is-a.dev']});assert.equal(env.scripts.length,1);env.sandbox.window.portfolioTrack('test',{project:'clooza',email:'private@example.com',message:'secret'});assert.equal(env.events.length,1);assert.equal(env.events[0][1].email,undefined);const clean=env.sandbox.window.portfolioBeforeSend('event',{url:'/frontend/?email=private&utm_source=linkedin#contact',referrer:'https://example.org/path?token=secret'});assert.equal(clean.url,'/frontend/?utm_source=linkedin');assert.equal(clean.referrer,'https://example.org/path');env.sandbox.window.portfolioAnalytics.setOptOut(true);env.sandbox.window.portfolioTrack('blocked');assert.equal(env.events.length,1);assert.equal(env.sandbox.window.portfolioBeforeSend('event',{}),false);env.sandbox.window.portfolioAnalytics.setOptOut(false);env.sandbox.navigator.doNotTrack='1';assert.equal(env.sandbox.window.portfolioBeforeSend('event',{}),false);
console.log(`Passed: ${pages.length} HTML pages, ${links} local links/assets, specialty scoping, payment transitions, and analytics privacy/configuration.`);
