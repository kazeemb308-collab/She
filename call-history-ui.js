/* Call-history UI hooks for chat.html and calls.html. */
(()=>{
 const h=()=>window.SheCallHistory;
 function chatRecord(x){const root=document.getElementById('messages');if(!root)return;const existing=root.querySelector(`[data-call-history-id="${x.id}"]`);if(existing)return;const el=document.createElement('div');el.className='call-message';el.dataset.callHistoryId=x.id;const icon=x.direction==='incoming'?'↙':'↗';const label=x.status==='missed'?'Missed':x.status==='declined'?'Declined':x.status==='cancelled'?'Cancelled':(x.type==='video'?'Video call':'Voice call');const duration=x.duration?` • ${Math.floor(x.duration/60)}:${String(x.duration%60).padStart(2,'0')}`:'';el.innerHTML=`<div class="call-message-icon">${x.type==='video'?'🎥':'📞'}</div><div><strong>${label}</strong><span>${icon}${duration}</span></div>`;root.appendChild(el);root.scrollTop=root.scrollHeight}
 function load(){const uid=localStorage.getItem('currentChatUid');if(!uid||!h())return;h().all().filter(x=>x.uid===uid).slice().reverse().forEach(chatRecord)}
 window.addEventListener('she:call-recorded',e=>chatRecord(e.detail));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
