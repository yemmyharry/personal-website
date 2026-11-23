(() => {
 'use strict';
 const config=window.PORTFOLIO_ANALYTICS||{};
 const optedOut=()=>{try{return localStorage.getItem('yh-analytics-optout')==='true';}catch{return true;}};
 const blocked=()=>optedOut()||navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.globalPrivacyControl===true;
 window.portfolioBeforeSend=(type,payload)=>{
  if(blocked())return false;
  const next={...payload};
  // Keep campaign attribution, discard arbitrary queries, fragments, and referrer queries.
  try{const u=new URL(next.url||location.href,location.origin);const clean=new URLSearchParams();for(const k of ['utm_source','utm_medium','utm_campaign']){const v=u.searchParams.get(k);if(v&&/^[a-zA-Z0-9_-]{1,80}$/.test(v))clean.set(k,v);}next.url=u.pathname+(clean.size?'?'+clean.toString():'');}catch{next.url=location.pathname;}
  if(next.referrer){try{const r=new URL(next.referrer);next.referrer=r.origin+r.pathname;}catch{next.referrer='';}}
  return next;
 };
 function load(){
  if(blocked()||document.getElementById('umami-tracker')||!config.websiteId||!config.scriptUrl)return;
  if(!config.domains?.includes(location.hostname))return;
  let url;try{url=new URL(config.scriptUrl);if(url.protocol!=='https:')return;}catch{return;}
  const script=document.createElement('script');script.id='umami-tracker';script.src=url.href;script.defer=true;script.dataset.websiteId=config.websiteId;script.dataset.domains=config.domains.join(',');script.dataset.doNotTrack='true';script.dataset.excludeHash='true';script.dataset.beforeSend='portfolioBeforeSend';document.head.append(script);
 }
 window.portfolioAnalytics={isOptedOut:optedOut,setOptOut(value){try{localStorage.setItem('yh-analytics-optout',String(value));}catch{return;}if(!value)load();}};
 window.portfolioTrack=(name,properties={})=>{
  if(blocked()||typeof window.umami?.track!=='function')return;
  const safe={specialty:document.body.dataset.role||'all'};
  // Only known, non-personal properties are allowed. Never pass form data or user text.
  for(const key of ['project','scenario','state','destination'])if(typeof properties[key]==='string'&&/^[a-zA-Z0-9/_-]{1,100}$/.test(properties[key]))safe[key]=properties[key];
  try{Promise.resolve(window.umami.track(name,safe)).catch(()=>{});}catch{}
 };
 document.addEventListener('click',e=>{const el=e.target.closest('[data-track]');if(!el||el.disabled)return;window.portfolioTrack(el.dataset.track,{project:el.dataset.project,destination:el.dataset.specialty});});
 load();
})();
