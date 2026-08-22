/* She stability bootstrap v6: paint the cached app shell before any async work. */
(()=>{
 const USER_KEY='she_current_user',LAST='she_last_rendered_user';
 const safe=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
 const user=()=>safe(USER_KEY),uid=()=>user()?.uid||user()?.id||'';
 const chat=()=>localStorage.getItem('currentChatUid')||new URLSearchParams(location.search).get('chat')||'';
 window.__SHE_STABILITY__={version:6};
 const reset=()=>{const id=uid(),old=localStorage.getItem(LAST)||'';if(id&&old&&old!==id){localStorage.removeItem('currentChatUid');try{sessionStorage.removeItem('currentChatUid')}catch{}}if(id)localStorage.setItem(LAST,id)};
 const listKey=()=>uid()?`she_chat_list_cache_v3_${uid()}`:'';
 const fullKey=()=>uid()&&chat()?`she_chat_full_v2_${uid()}_${chat()}`:'';
 const paint=(el,html)=>{if(!el||!html||el.childElementCount)return false;const t=document.createRange().createContextualFragment(html);el.replaceChildren(t);el.classList.add('ready');return true};
 const restoreList=()=>{const e=document.getElementById('chatList'),c=listKey()&&safe(listKey());if(e&&c?.html)paint(e,c.html)};
 const restoreFull=()=>{const e=document.getElementById('messages'),c=fullKey()&&safe(fullKey());if(e&&c?.html){paint(e,c.html);const n=document.querySelector('.chat-profile h3');if(n&&c.header?.name)n.textContent=c.header.name}};
 reset();
 // Paint synchronously before Firebase, navigation, or feature modules can run.
 restoreList(); if(document.body?.classList.contains('chat-page'))restoreFull();
 // Only establish network connections after the cached UI is already visible.
 const connect=()=>{['https://www.gstatic.com','https://firestore.googleapis.com','https://identitytoolkit.googleapis.com'].forEach(h=>{if(!document.head.querySelector(`link[rel=preconnect][href="${h}"]`)){const l=document.createElement('link');l.rel='preconnect';l.href=h;l.crossOrigin='anonymous';document.head.appendChild(l)}});if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(()=>{})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
 const boot=()=>{const e=document.getElementById('chatList');if(!e)return;let t;const save=()=>{clearTimeout(t);t=setTimeout(()=>{const k=listKey();if(k&&e.innerHTML.trim())try{localStorage.setItem(k,JSON.stringify({html:e.innerHTML,savedAt:Date.now()}))}catch{}},700)};new MutationObserver(save).observe(e,{childList:true,subtree:true});window.addEventListener('pagehide',save,{once:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();