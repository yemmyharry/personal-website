// Pure payment transition logic. Exposed for the browser and imported by validation.
const PaymentLab = {
 initial:()=>({id:null,status:'idle',version:0,recorded:false}),
 reduce(state,event){
  if(event.version<=state.version)return {state,outcome:'stale',recorded:false};
  if(state.status==='succeeded'&&event.status!=='succeeded')return {state,outcome:'rejected',recorded:false};
  const recorded=event.status==='succeeded'&&!state.recorded;
  return {state:{...state,status:event.status,version:event.version,recorded:state.recorded||recorded},outcome:recorded?'recorded':'updated',recorded};
 }
};
if(typeof window!=='undefined')window.PaymentLab=PaymentLab;
if(typeof module!=='undefined')module.exports=PaymentLab;
