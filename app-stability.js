/* She stability bootstrap v8: one cache authority; online never restores stale DOM. */
(()=>{
'use strict';
const VERSION=8,USER_KEY='she_current_user',LAST='she_last_rendered_user';
const safe=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const user=()=>safe(USER_KEY),uid=()=>user()?.uid||user()?.id||'';
const chat=()=>localStorage.getItem('currentChatUid')||new URLSearchParams(location.search).get('chat')||'';
const online=()=>navigator.onLine!==false;
window.__SHE_STABILITY__={version:VERSION};
const reset=()=>{const id=uid(),old=localStorage.getItem(LAST)||'';if(id&&old&&old!==id){localStorage.removeItem('currentChatUid');try{sessionStorage.removeItem('currentChatUid')}catch{}}if(id)localStorage.setItem(LAST,id)};
const listKey=()=>uid()?`she_chat_list_cache_v3_${uid()}`:'';
const fullKey=()=>uid()&&chat()?`she_chat_full_v2_${uid()}_${chat()}`:'';
const paint=(el,html)=>{if(!el||!html||el.childElementCount)return false;el.replaceChildren(document.createRange().createContextualFragment(html));el.classList.add('ready');return true};
const restoreList=()=>{if(online())return;const e=document.getElementById('chatList'),c=listKey()&&safe(listKey());if(e&&c?.html)paint(e,c.html)};
const restoreFull=()=>{if(online())return;const e=document.getElementById('messages'),c=fullKey()&&safe(fullKey());if(e&&c?.html){paint(e,c.html);const n=document.querySelector('.chat-profile h3');if(n&&c.header?.name)n.textContent=c.header.name}};
reset();restoreList();restoreFull();
const connect=async()=>{if(!('serviceWorker'in navigator))return;try{const reg=await navigator.serviceWorker.register(`/sw.js?version=${VERSION}`,{scope:'/',updateViaCache:'none'});await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!sessionStorage.getItem('she_sw_reloaded_v8')){sessionStorage.setItem('she_sw_reloaded_v8','1');location.reload()}})}catch(_){}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});else connect();
const boot=()=>{const e=document.getElementById('chatList');if(!e)return;let t;const save=()=>{if(online())return;clearTimeout(t);t=setTimeout(()=>{const k=listKey();if(k&&e.innerHTML.trim())try{localStorage.setItem(k,JSON.stringify({html:e.innerHTML,savedAt:Date.now()}))}catch{}},700)};new MutationObserver(save).observe(e,{childList:true,subtree:true});window.addEventListener('pagehide',save,{once:true})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('online',()=>location.reload());
})();