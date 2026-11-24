(() => {
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
 const root=document.documentElement;
 const theme=$('.theme-toggle');
 function themeLabel(){const label=root.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme';theme?.setAttribute('aria-label',label);if(theme)theme.title=label;}
 themeLabel();theme?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('yh-theme',root.dataset.theme);}catch{}themeLabel();});
 const menu=$('.menu-toggle'),nav=$('#nav-links');
 function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
 $$('#nav-links a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))closeMenu();});
 window.matchMedia('(min-width: 851px)').addEventListener('change',closeMenu);
 $('#print-resume')?.addEventListener('click',()=>window.print());

 // A versioned, local payment simulation. The state reducer is shared with checks.
 const reduce=window.PaymentLab?.reduce;
 if($('#event-log')&&reduce){
  let state=window.PaymentLab.initial(),sequence=0,lastEvent=null,pending=null;
  const received=new Set();let events=0,payments=0,duplicates=0;
  const scenarios=$$('[data-scenario]'),hero=$('#hero-send');
  function log(level,message){const p=document.createElement('p'),label=document.createElement('span');label.textContent=level;p.append(label,document.createTextNode(message));$('#event-log').append(p);while($('#event-log').children.length>30)$('#event-log').firstElementChild.remove();$('#event-log').scrollTop=$('#event-log').scrollHeight;}
  function controls(){scenarios.forEach(b=>b.disabled=pending!==null);if(hero)hero.disabled=pending!==null;$('#replay').disabled=!lastEvent||pending!==null;$('#retry').disabled=state.status!=='failed'||pending!==null;$('#events-count').textContent=events;$('#payments-count').textContent=payments;$('#duplicates-count').textContent=duplicates;}
  function render(note){$('#payment-id').textContent=state.id||'NO PAYMENT YET';$('#payment-state').textContent=({idle:'Ready to explore.',pending:'Payment pending.',succeeded:'Payment recorded.',failed:'Payment failed.'})[state.status];$('#lab-state').textContent=pending!==null?'WAITING':state.status.toUpperCase();$('#payment-outcome').textContent=note;const done=state.status==='succeeded';$('.hero-board')?.classList.toggle('is-settled',done);if($('#hero-receipt-title'))$('#hero-receipt-title').textContent=done?'One payment. Recorded once.':state.status==='failed'?'A failure with a way forward.':state.status==='pending'?'Waiting for confirmation.':'Ready when you are.';if($('#hero-receipt-copy'))$('#hero-receipt-copy').textContent=done?'Replay its event in the workbench below.':'A tiny experiment in reliable payments.';if(hero)hero.textContent=done?'Try another payment':'Try a payment';controls();}
  function start(){state={...window.PaymentLab.initial(),id:'pay_demo_'+String(++sequence).padStart(3,'0'),status:'pending'};log('START',state.id+' · pending');}
  function deliver(event){lastEvent=event;events++;if(received.has(event.id)){duplicates++;log('SKIPPED','Duplicate '+event.id);render('The event repeated. The payment count stayed the same.');return;}received.add(event.id);const result=reduce(state,event);if(result.recorded)payments++;state=result.state;log(result.outcome.toUpperCase(),event.status+' · version '+event.version);render(result.outcome==='stale'?'An older event arrived. The newer payment state is preserved.':result.outcome==='recorded'?'The payment is recorded once. Try replaying its event.':result.outcome==='rejected'?'That transition would undo a completed payment. State preserved.':state.status==='failed'?'Nothing recorded. A retry can safely try this payment again.':'Waiting for a final payment event.');}
  function run(scenario){if(pending!==null)return;start();window.portfolioTrack?.('payment_scenario',{scenario});const prefix=state.id;
   if(scenario==='delay'){log('WAIT','Delivery scheduled in 2 seconds.');pending=setTimeout(()=>{pending=null;deliver({id:prefix+'_paid',status:'succeeded',version:2});},2000);render('The request is pending while delivery is delayed.');return;}
   if(scenario==='order'){deliver({id:prefix+'_paid',status:'succeeded',version:2});deliver({id:prefix+'_pending',status:'pending',version:1});return;}
   deliver({id:prefix+(scenario==='fail'?'_failed':'_paid'),status:scenario==='fail'?'failed':'succeeded',version:1});
  }
  scenarios.forEach(b=>b.addEventListener('click',()=>run(b.dataset.scenario)));
  hero?.addEventListener('click',()=>run('success'));
  $('#replay').addEventListener('click',()=>{if(lastEvent){window.portfolioTrack?.('payment_replay',{});deliver(lastEvent);}});
  $('#retry').addEventListener('click',()=>{if(state.status!=='failed')return;window.portfolioTrack?.('payment_retry',{});deliver({id:state.id+'_retry_paid',status:'succeeded',version:state.version+1});});
  $('#reset-lab').addEventListener('click',()=>{clearTimeout(pending);pending=null;state=window.PaymentLab.initial();lastEvent=null;events=0;payments=0;duplicates=0;received.clear();$('#event-log').replaceChildren();log('READY','Waiting for an event…');render('Choose a scenario. Follow the state.');});
  controls();
 }else if($('#hero-send')){
  let explored=false;
  $('#hero-send').addEventListener('click',()=>{
   if(explored){$('#lab').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
   explored=true;$('.hero-board')?.classList.add('is-settled');$('#hero-receipt-title').textContent='One payment. Clear feedback.';$('#hero-receipt-copy').textContent='Explore more interface states below.';$('#hero-send').textContent='Try the interface states';
  });
 }
 const ui=$('#ui-state-body');
 function setUI(type){if(!ui)return;const views={success:'<span class="sample-status">Payment complete</span><h4>All settled.</h4><span class="sample-amount">₦12,500</span><div class="sample-detail"><span>Reference</span><b>DEMO-001</b></div><div class="sample-detail"><span>Status</span><b>Confirmed</b></div>',loading:'<span class="sample-status">Processing</span><h4>Checking the details.</h4><p>Your payment is being confirmed. No need to send it again.</p><div class="skeleton large" aria-hidden="true"></div><div class="skeleton" aria-hidden="true"></div><div class="skeleton short" aria-hidden="true"></div>',empty:'<span class="sample-status">No activity yet</span><h4>A fresh start.</h4><p>Your payments will appear here. Try a sample transaction to see the complete state.</p><button data-ui-action="success">Try a sample payment</button>',error:'<span class="sample-status">Couldn’t load payments</span><h4>Let’s try that again.</h4><p>Your payment list is unavailable. This message doesn’t mean a payment failed.</p><button data-ui-action="success">Retry loading</button>'};ui.innerHTML=views[type]||views.success;$$('[data-ui-state]').forEach(b=>{const active=b.dataset.uiState===type;b.setAttribute('aria-pressed',String(active));b.classList.toggle('primary',active);});}
 if(ui){setUI('success');$$('[data-ui-state]').forEach(b=>b.addEventListener('click',()=>{setUI(b.dataset.uiState);window.portfolioTrack?.('interface_state',{state:b.dataset.uiState});}));ui.addEventListener('click',e=>{const button=e.target.closest('[data-ui-action]');if(button)setUI(button.dataset.uiAction);});$('#compact-ui').addEventListener('change',e=>$('#interface-preview').classList.toggle('compact',e.target.checked));}
 const form=$('#contact-form');
 form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type=submit]'),status=$('#contact-status');button.disabled=true;button.textContent='Sending…';status.textContent='';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!response.ok)throw new Error('send failed');status.textContent='Message sent. Thanks for getting in touch.';form.reset();window.portfolioTrack?.('contact_success',{});}catch{status.textContent='Your message could not be sent. Please try again or contact me on LinkedIn.';}finally{button.disabled=false;button.textContent='Send message';}});
 const optout=$('#analytics-optout');
 if(optout){function update(){const off=window.portfolioAnalytics?.isOptedOut()||false;optout.textContent=off?'Enable analytics for this browser':'Disable analytics for this browser';optout.setAttribute('aria-pressed',String(off));$('#privacy-status').textContent=window.portfolioAnalytics?.status()||'Analytics are unavailable on this version of the site.';}update();window.addEventListener('portfolio-analytics-status',update);optout.addEventListener('click',()=>{window.portfolioAnalytics?.setOptOut(!window.portfolioAnalytics.isOptedOut());update();});}
})();

// A tactile, progressively enhanced layer. Content stays usable without motion or JS.
(() => {
 'use strict';
 const root=document.documentElement;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
 const motionButtons=[...document.querySelectorAll('.motion-toggle')];
 let paused=false;
 try{paused=localStorage.getItem('yh-motion')==='off';}catch{}
 function updateMotion(){
  const active=!paused&&!reduced.matches;
  root.dataset.motion=active?'on':'off';
  motionButtons.forEach(button=>{
   button.textContent=reduced.matches?'Reduced motion':paused?'Enable motion':'Pause motion';
   button.setAttribute('aria-pressed',String(!active));
   button.disabled=reduced.matches;
  });
  if(!active)resetTilt();
 }
 motionButtons.forEach(button=>button.addEventListener('click',()=>{
  paused=!paused;try{localStorage.setItem('yh-motion',paused?'off':'on');}catch{}
  updateMotion();
 }));
 reduced.addEventListener('change',updateMotion);
 const board=document.querySelector('.hero-board');
 let tiltFrame=0;
 function resetTilt(){
  if(tiltFrame)cancelAnimationFrame(tiltFrame);tiltFrame=0;
  board?.style.removeProperty('--tilt-x');board?.style.removeProperty('--tilt-y');
 }
 board?.addEventListener('pointermove',event=>{
  if(root.dataset.motion!=='on'||!finePointer.matches||event.pointerType==='touch')return;
  const rect=board.getBoundingClientRect();
  const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
  const y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
  if(tiltFrame)cancelAnimationFrame(tiltFrame);
  tiltFrame=requestAnimationFrame(()=>{board.style.setProperty('--tilt-x',`${-y*3}deg`);board.style.setProperty('--tilt-y',`${x*3}deg`);tiltFrame=0;});
 });
 board?.addEventListener('pointerleave',resetTilt);
 board?.addEventListener('pointercancel',resetTilt);
 finePointer.addEventListener('change',resetTilt);
 updateMotion();

 const mood=document.getElementById('workbench-mood');
 window.PortfolioAppearance?.refresh();
 mood?.addEventListener('click',()=>window.PortfolioAppearance?.cyclePalette());
 const traceButtons=[...document.querySelectorAll('[data-trace]')];
 const isFrontend=document.body.dataset.role==='frontend';
 const traceCopy=isFrontend?{
  entry:'An action should make the next step clear. Start with the person using the screen.',
  core:'The interface connects a person’s intent to the rules of the product.',
  state:'Loading, empty, success, and error states all need useful feedback.',
  rails:'A failed request should offer a way forward. Try the interface-state lab below.'
 }:{
  entry:'One tap starts a workflow. Validate the request before changing any state.',
  core:'The service coordinates business rules, provider calls, and the payment lifecycle.',
  state:'A repeated event should not record the payment twice. Try replay in the lab below.',
  rails:'Provider responses can be late or arrive out of order. The payment state still needs to make sense.'
 };
 traceButtons.forEach(button=>button.addEventListener('click',()=>{
  traceButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.getElementById('board-insight').textContent=traceCopy[button.dataset.trace];
  window.portfolioTrack?.('workbench_layer',{state:button.dataset.trace});
 }));

 const symbol=document.querySelector('.identity-symbol');
 const originalMark=symbol?.firstElementChild?.cloneNode(true);
 let variant=0;
 document.getElementById('remix-mark')?.addEventListener('click',()=>{
  if(!symbol)return;
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 320 280');svg.setAttribute('aria-hidden','true');
  const colors=['#38573c','#718c58','#a2b584'];
  const frame=document.createElementNS(ns,'rect');
  for(const [key,value]of Object.entries({x:45,y:25,width:230,height:230,rx:12,fill:'none',stroke:'currentColor','stroke-opacity':'.18'}))frame.setAttribute(key,value);
  svg.append(frame);
  for(let row=0;row<5;row++)for(let col=0;col<3;col++){
   if(Math.random()<.35)continue;
   const fill=colors[Math.floor(Math.random()*colors.length)];
   for(const mirrored of col===2?[col]:[col,4-col]){
    const cell=document.createElementNS(ns,'rect');
    for(const [key,value]of Object.entries({x:61+mirrored*40,y:41+row*40,width:36,height:36,rx:Math.random()>.65?18:3,fill}))cell.setAttribute(key,value);
    svg.append(cell);
   }
  }
  symbol.replaceChildren(svg);variant++;
  document.getElementById('identity-status').textContent=`Abstract mark remixed. Variant ${variant}.`;
 });
 document.getElementById('reset-mark')?.addEventListener('click',()=>{
  if(symbol&&originalMark)symbol.replaceChildren(originalMark.cloneNode(true));
  const status=document.getElementById('identity-status');if(status)status.textContent='Original YH signature restored.';
 });

 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  },{threshold:.08,rootMargin:'0px 0px 24px 0px'});
  const items=document.querySelectorAll('.project-card,.section-heading,.identity-card,.essay-row,.career-list article');
  items.forEach((item,index)=>{item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',`${Math.min(index%2,1)*70}ms`);observer.observe(item);});
  root.classList.add('motion-enabled');
 }
 const progress=document.querySelector('.reading-progress span');let progressFrame=0;
 function updateProgress(){progressFrame=0;const max=root.scrollHeight-innerHeight;const value=max>0?Math.max(0,Math.min(1,scrollY/max)):1;if(progress)progress.style.transform=`scaleX(${value})`;}
 function queueProgress(){if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);}
 window.addEventListener('scroll',queueProgress,{passive:true});
 window.addEventListener('resize',queueProgress,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){resetTilt();if(progressFrame)cancelAnimationFrame(progressFrame);progressFrame=0;}else queueProgress();});
 updateProgress();
})();
