/** Small, deterministic state transitions for participant-controlled sessions. */
export const CATEGORIES = ['settle','explore','move','pause','close'];
export const PRESETS = {
  gentle:{title:'A gentle introduction',activities:[['Arrive and settle','Choose a comfortable place. Take as much time as you need.',3,'settle'],['Explore a texture','Choose an object to look at or touch. Watching is also an option.',4,'explore'],['A quiet pause','Rest, stretch, or sit quietly. There is no task to complete.',3,'pause'],['Close together','Choose how to finish: a word, a gesture, or a quiet goodbye.',2,'close']]},
  movement:{title:'Movement and a pause',activities:[['Find your space','Choose where you would like to begin.',2,'settle'],['Choose a movement','Stretch, walk, or stay seated. Choose what feels comfortable.',4,'move'],['Take a pause','Choose a quieter place or stay where you are.',3,'pause'],['Finish your way','Let the facilitator know if you want to finish or plan another time.',2,'close']]},
  observation:{title:'An optional robot observation',activities:[['Choose your distance','Look at a stationary robot from a distance you choose, or decline.',3,'settle'],['Notice one detail','Choose something to notice. There is no need to approach or touch.',3,'explore'],['Pause away from the activity','Take a break in a space of your choice.',3,'pause'],['Close the session','Choose whether to share a thought or simply finish.',2,'close']]},
};

export function presetPlan(name='gentle') {
  const preset=PRESETS[name];if(!preset)throw new Error('Unknown session template.');
  return {version:1,title:preset.title,preferences:{showTimer:false,highContrast:false},activities:preset.activities.map(([title,description,minutes,category],i)=>({id:`step-${i+1}`,title,description,minutes,category}))};
}
export function validatePlan(input) {
  if(!input||input.version!==1)throw new Error('Plan version must be 1.');
  const text=(value,max,label)=>{if(typeof value!=='string'||!value.trim()||value.trim().length>max)throw new Error(`${label} must contain 1–${max} characters.`);return value.trim();};
  if(!Array.isArray(input.activities)||input.activities.length<1||input.activities.length>12)throw new Error('A plan must contain 1–12 activities.');
  const ids=new Set();
  const activities=input.activities.map(activity=>{
    if(!activity||typeof activity!=='object')throw new Error('Each activity must be an object.');
    const id=text(activity.id,60,'Activity identifier');if(ids.has(id))throw new Error('Activity identifiers must be unique.');ids.add(id);
    if(!Number.isInteger(activity.minutes)||activity.minutes<1||activity.minutes>30)throw new Error('Activity duration must be a whole number from 1 to 30 minutes.');
    if(!CATEGORIES.includes(activity.category))throw new Error('Choose a supported activity category.');
    return {id,title:text(activity.title,80,'Activity title'),description:text(activity.description,240,'Activity description'),minutes:activity.minutes,category:activity.category};
  });
  const preferences=input.preferences??{};
  for(const key of ['showTimer','highContrast'])if(key in preferences&&typeof preferences[key]!=='boolean')throw new Error('Display preferences must be true or false.');
  return {version:1,title:text(input.title,100,'Plan title'),preferences:{showTimer:preferences.showTimer??false,highContrast:preferences.highContrast??false},activities};
}
export function reorderActivity(plan,index,direction) {
  const next=validatePlan(plan),target=index+direction;
  if(!Number.isInteger(index)||![-1,1].includes(direction)||index<0||index>=next.activities.length||target<0||target>=next.activities.length)throw new Error('The activity cannot move further in that direction.');
  [next.activities[index],next.activities[target]]=[next.activities[target],next.activities[index]];return next;
}
export function createSession(plan) {
  const snapshot=validatePlan(plan);
  return {plan:snapshot,index:0,status:'running',remaining:snapshot.activities[0].minutes*60,elapsed:0,history:[]};
}
export function tick(previous,seconds) {
  if(!Number.isFinite(seconds)||seconds<0)throw new Error('Elapsed time must be a non-negative finite number.');
  const state=structuredClone(previous);
  if(state.status!=='running')return state;
  const used=Math.min(state.remaining,seconds);state.remaining-=used;state.elapsed+=used;
  if(state.remaining===0)state.status='ready';
  return state;
}
export function changeSession(previous,action) {
  const state=structuredClone(previous);
  if(['finished','ended'].includes(state.status))throw new Error('This session has ended. Start another session when ready.');
  if(action==='pause'){
    if(state.status!=='running')throw new Error('Only a running activity can be paused.');state.status='paused';
  }else if(action==='resume'){
    if(state.status!=='paused')throw new Error('This activity is not paused.');state.status='running';
  }else if(action==='complete'||action==='skip'){
    state.history.push({id:state.plan.activities[state.index].id,outcome:action==='skip'?'skipped':'completed',elapsed:state.elapsed});
    if(state.index===state.plan.activities.length-1){state.status='finished';state.remaining=0;}
    else{state.index++;state.remaining=state.plan.activities[state.index].minutes*60;state.elapsed=0;state.status='running';}
  }else if(action==='end'){
    state.history.push({id:state.plan.activities[state.index].id,outcome:'ended',elapsed:state.elapsed});state.status='ended';
  }else throw new Error('Unknown session action.');
  return state;
}
export function formatTime(seconds){const value=Math.max(0,Math.ceil(seconds));return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;}
export const plannedMinutes=plan=>plan.activities.reduce((sum,activity)=>sum+activity.minutes,0);
