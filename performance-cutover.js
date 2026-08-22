/* She performance cutover v4: cache first, Firebase refresh without N+1 user reads. */
(()=>{
 'use strict';
 const USER_KEY='she_current_user',CACHE=uid=>`she_chats_dom_v2_${uid}`;
 let unsubscribe=null,activeUid=null;
 const user=()=>{try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}};
 const restore=uid=>{const e=document.getElementById('chatList');if(!e||!uid)return;try{const h=localStorage.getItem(CACHE(uid));if(h&& !e.children.length){e.innerHTML=h;e.classList.add('ready')}}catch{}};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const preview=v=>{v=v||'No messages yet';return esc(v.length>30?v.slice(0,30)+'...':v)};
 const time=v=>{if(!v)return '';try{const d=v.toDate?v.toDate():new Date(v.seconds?v.seconds*1000:v);return d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}catch{return ''}};
 async function liveLoad(){
  const uid=user()?.uid;if(!uid)return;
  for(let i=0;i<100&&!(window.SheFirebase?.auth&&window.SheFirebase?.db);i++)await new Promise(r=>setTimeout(r,50));
  const fb=window.SheFirebase;if(!fb||activeUid!==uid)return;
  unsubscribe?.();
  const {collection,query,where,onSnapshot,doc,getDocs}=fb.firestore;
  const q=query(collection(fb.db,'conversations'),where('participants','array-contains',uid));
  unsubscribe=onSnapshot(q,async snap=>{
   if(activeUid!==uid)return;
   const rows=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.updatedAt?.seconds||b.lastMessageTime?.seconds||0)-(a.updatedAt?.seconds||a.lastMessageTime?.seconds||0));
   const ids=[...new Set(rows.flatMap(c=>c.participants||[]).filter(x=>x!==uid))];
   const users={};
   if(ids.length){const refs=ids.map(id=>doc(fb.db,'users',id));try{const snaps=await getDocs(refs);snaps.forEach(s=>{users[s.id]=s.exists()?s.data():{}})}catch{}}
   const list=document.getElementById('chatList');if(!list||activeUid!==uid)return;
   const html=rows.map(chat=>{const other=chat.participants?.find(x=>x!==uid);if(!other)return '';const u=users[other]||{};const unread=Array.isArray(chat.unreadBy)&&chat.unreadBy.includes(uid);const av=u.photoData?`<img src="${esc(u.photoData)}" alt="Profile photo">`:'👤';return `<div class="chat-item ${unread?'unread':''}" data-chat-uid="${esc(other)}" onclick="openChat('${esc(other)}')"><div class="avatar chat-avatar">${av}</div><div class="chat-info"><div class="chat-top"><h3>${esc(u.displayName||'User')}</h3><span class="message-time">${time(chat.lastMessageTime||chat.updatedAt)}</span></div><div class="chat-bottom"><p>${preview(chat.lastMessage)}</p>${unread?`<span class="unread-badge">${chat.unreadBy.length||1}</span>`:''}</div></div></div>`}).join('');
   if(html){list.innerHTML=html;list.classList.add('ready');try{localStorage.setItem(CACHE(uid),html)}catch{}}
  },e=>console.warn('She chat listener:',e));
 }
 function install(){const uid=user()?.uid;if(!uid)return;activeUid=uid;restore(uid);window.loadChats=liveLoad;}
 install();
})();