/* Persistent call history: records calls in the chat and Calls page. */
(()=>{
 const KEY='she_call_history_v2';
 const now=()=>Date.now();
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
 const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v.slice(0,200)))}catch{}};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.SheCallHistory={record(call){const h=read();const item={id:crypto.randomUUID?.()||String(now()),uid:call.uid||'',name:call.name||'Unknown',direction:call.direction||'outgoing',type:call.type||'voice',status:call.status||'completed',duration:Number(call.duration)||0,at:now()};h.unshift(item);write(h);window.dispatchEvent(new CustomEvent('she:call-recorded',{detail:item}));return item},all:read};
 function renderCalls(){const root=document.querySelector('.calls-list');if(!root)return;let box=root.querySelector('#dynamicCallHistory');if(!box){box=document.createElement('div');box.id='dynamicCallHistory';root.appendChild(box)}const h=read();box.innerHTML=h.length?h.map(x=>{const icon=x.direction==='incoming'?'↙':'↗';const type=x.type==='video'?'Video':'Voice';const dur=x.duration?` • ${Math.floor(x.duration/60)}:${String(x.duration%60).padStart(2,'0')}`:'';return `<div class="call-item" data-call-id="${esc(x.id)}"><div class="avatar">${x.type==='video'?'🎥':'📞'}</div><div class="call-details"><h3>${esc(x.name)}</h3><p>${icon} ${type} • ${new Date(x.at).toLocaleDateString([], {day:'numeric',month:'short'})}${dur}</p></div><button class="call-button" data-call-uid="${esc(x.uid)}" data-call-name="${esc(x.name)}">📞</button></div>`}).join(''):'<p class="empty-calls">No recent calls</p>';
 }
 window.addEventListener('she:call-recorded',e=>{renderCalls();window.dispatchEvent(new CustomEvent('she:call-history-updated',{detail:e.detail}))});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderCalls);else renderCalls();
})();
