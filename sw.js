/* She service worker v8 — never serve stale HTML while online */
const CACHE='she-shell-v8';
const VERSION='2026-08-23-v8';
const SHELL=['/','/index.html','/login.html','/signup.html','/app.html','/chats.html','/chat.html','/calls.html','/contacts.html','/status.html','/profile.html','/new-chat.html','/new-group.html','/group-info.html','/edit-profile.html','/settings.html','/forgot-password.html','/reset-password.html','/style.css','/responsive.css','/responsive-fixes.css','/mobile-stability.css','/mobile-chat-layout.css','/global-theme.css','/navigation.css','/modern-chat-icons.css','/voice-call-modern.css','/call-history-modern.css','/navigation.js','/app-stability.js','/performance-cutover.js','/app.js','/legacy-app.js','/app-fixes.js','/feature-bootstrap.js','/features/page-adapter.js','/core/app-runtime.js','/core/bootstrap.js','/core/session-coordinator.js','/core/presence-coordinator.js','/core/presence-ui.js','/core/service-registry.js','/core/app-state.js','/chats-whatsapp.js','/chat-instant-cache.js','/chat-full-cache.js','/chat-scroll-fix.js','/message-render-atomic.js','/send-dedupe.js','/voice-note.js','/voice-call-screen.js','/voice-call-webrtc.js','/live-call-v2.js','/live-call-caller-v2.js','/call-navigation-shell.js','/push-notifications.js','/call-history.js','/call-history-ui.js','/manifest.json','/favicon.svg'];
const own=u=>u.origin===self.location.origin;
async function cacheShell(){const c=await caches.open(CACHE);for(const path of SHELL){try{const r=await fetch(new Request(new URL(path+'?__she_sw='+VERSION,self.location),{cache:'no-store'}));if(r.ok)await c.put(path,r)}catch(_){}}}
self.addEventListener('install',e=>e.waitUntil(cacheShell().then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('she-shell-')&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);if(!own(u))return;
 if(req.mode==='navigate'){
  e.respondWith((async()=>{try{const freshUrl=new URL(req.url);freshUrl.searchParams.set('__she_fresh',VERSION);const r=await fetch(new Request(freshUrl.href,{method:'GET',headers:req.headers,credentials:'include',redirect:'follow',cache:'no-store'}));if(r.ok){const c=await caches.open(CACHE);c.put(u.pathname,r.clone()).catch(()=>{});}return r}catch(_){const c=await caches.open(CACHE);return await c.match(u.pathname)||await c.match('/chats.html')||new Response('Offline',{status:503,statusText:'Offline'})}})());return;
 }
 e.respondWith((async()=>{try{const r=await fetch(req);if(r.ok){const c=await caches.open(CACHE);c.put(req,r.clone()).catch(()=>{});}return r}catch(_){return await caches.match(req)||new Response('',{status:503,statusText:'Offline'})}})());
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')e.waitUntil?.(self.skipWaiting())});
