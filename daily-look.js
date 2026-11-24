(() => {
 'use strict';
 const root=document.documentElement;
 const palettes=['sage','blue','peach'];
 const patterns=['dots','grid','diagonal','rings'];
 function forDate(date=new Date()){
  // Use the visitor's calendar date; UTC arithmetic avoids daylight-saving drift.
  const year=date.getFullYear(),month=date.getMonth(),day=date.getDate();
  const ordinal=Math.floor(Date.UTC(year,month,day)/86400000);
  return {date:`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,palette:palettes[((ordinal%3)+3)%3],artwork:patterns[((ordinal%4)+4)%4]};
 }
 function updateLabel(){
  const button=document.getElementById('workbench-mood');
  if(button){
   button.setAttribute('aria-label',`Change accent color; current palette ${root.dataset.palette}`);
   button.title=`Accent palette: ${root.dataset.palette}. Try another color.`;
  }
 }
 function refresh(){
  const look=forDate();
  if(root.dataset.appearanceDate!==look.date){
   root.dataset.appearanceDate=look.date;
   root.dataset.palette=look.palette;
   root.dataset.artwork=look.artwork;
  }
  updateLabel();
 }
 function cyclePalette(){
  root.dataset.palette=palettes[(palettes.indexOf(root.dataset.palette)+1)%palettes.length];
  updateLabel();
 }
 let midnightTimer;
 function schedule(){
  clearTimeout(midnightTimer);
  const now=new Date();
  const midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  midnightTimer=setTimeout(()=>{refresh();schedule();},midnight-now+100);
 }
 window.PortfolioAppearance={forDate,refresh,cyclePalette};
 refresh();schedule();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){refresh();schedule();}});
 window.addEventListener('pageshow',()=>{refresh();schedule();});
})();
