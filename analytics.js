(() => {
 'use strict';
 const config=window.PORTFOLIO_ANALYTICS||{};
 let trackerState='idle';
 const notify=()=>window.dispatchEvent(new Event('portfolio-analytics-status'));
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
 function status(){
  if(optedOut())return 'Analytics are disabled by your preference in this browser.';
  if(navigator.doNotTrack==='1'||window.doNotTrack==='1')return 'Visits are excluded because your browser sends Do Not Track.';
  if(navigator.globalPrivacyControl===true)return 'Visits are excluded because your browser sends Global Privacy Control.';
  if(!config.websiteId||!config.scriptUrl)return 'Analytics are not configured on this version of the site.';
  if(!config.domains?.includes(location.hostname))return 'Visits to this preview or hostname are excluded from analytics.';
  try{if(localStorage.getItem('umami.disabled'))return 'Visits are excluded by the Umami opt-out setting in this browser.';}catch{}
  if(trackerState==='error')return 'The analytics script could not load. A content blocker or network issue may be preventing it.';
  if(trackerState==='loaded')return 'The analytics script loaded. Browser extensions or network rules can still block delivery.';
  return 'The analytics script is loading. If this persists, a content blocker or network issue may be preventing it.';
 }
 function load(){
  if(blocked()||document.getElementById('umami-tracker')||!config.websiteId||!config.scriptUrl)return;
  if(!config.domains?.includes(location.hostname))return;
  let url;try{url=new URL(config.scriptUrl);if(url.protocol!=='https:')return;}catch{return;}
  const script=document.createElement('script');script.id='umami-tracker';script.src=url.href;script.defer=true;script.dataset.websiteId=config.websiteId;script.dataset.domains=config.domains.join(',');script.dataset.doNotTrack='true';script.dataset.excludeHash='true';script.dataset.beforeSend='portfolioBeforeSend';trackerState='loading';script.onload=()=>{trackerState='loaded';notify();};script.onerror=()=>{trackerState='error';notify();};document.head.append(script);
 }
 window.portfolioAnalytics={isOptedOut:optedOut,status,setOptOut(value){try{localStorage.setItem('yh-analytics-optout',String(value));}catch{return;}if(!value)load();}};
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
