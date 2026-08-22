/* She offline-first service worker v4 */
const CACHE="she-shell-v4";
const SHELL=[
 "/","/index.html","/login.html","/signup.html","/app.html",
 "/chats.html","/chat.html","/calls.html","/contacts.html","/status.html","/profile.html","/new-chat.html","/new-group.html","/group-info.html","/edit-profile.html","/settings.html","/forgot-password.html","/reset-password.html",
 "/style.css","/responsive.css","/responsive-fixes.css","/mobile-stability.css","/mobile-chat-layout.css","/global-theme.css","/navigation.css","/modern-chat-icons.css",
 "/navigation.js","/app-stability.js","/performance-cutover.js","/app.js","/legacy-app.js","/app-fixes.js","/feature-bootstrap.js",
 "/core/app-runtime.js","/core/bootstrap.js","/core/session-coordinator.js","/core/presence-coordinator.js","/core/presence-ui.js","/core/service-registry.js","/core/app-state.js",
 "/features/page-adapter.js","/chats-whatsapp.js","/chat-instant-cache.js","/chat-full-cache.js","/chat-scroll-fix.js","/message-render-atomic.js","/send-dedupe.js",
 "/voice-note.js","/voice-call-modern.css","/voice-call-screen.js","/voice-call-webrtc.js","/live-call-v2.js","/live-call-caller-v2.js","/call-navigation-shell.js","/push-notifications.js",
 "/manifest.json","/favicon.svg"
];
const sameOrigin=u=>u.origin===self.location.origin;
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(async cache=>{await Promise.all(SHELL.map(async url=>{try{await cache.add(url)}catch(e){}})}).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(!sameOrigin(url))return;
 event.respondWith((async()=>{
   const cached=await caches.match(req);
   try{
     const network=await fetch(req);
     if(network.ok){const copy=network.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
     return network;
   }catch(e){
     if(cached)return cached;
     if(req.mode==="navigate"){
       const fallback=await caches.match("/chats.html");
       return fallback||new Response("Offline",{status:503,headers:{"Content-Type":"text/plain"}});
     }
     return new Response("",{status:503});
   }
 })());
});
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("notificationclick",event=>{event.notification.close();event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{for(const c of list)if("focus"in c)return c.focus();return clients.openWindow("/chats.html")}))});