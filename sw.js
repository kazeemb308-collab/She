/* She offline-first service worker v5 */
const CACHE="she-shell-v5";
const SHELL=[
 "/","/index.html","/login.html","/signup.html","/app.html","/chats.html","/chat.html","/calls.html","/contacts.html","/status.html","/profile.html","/new-chat.html","/new-group.html","/group-info.html","/edit-profile.html","/settings.html","/forgot-password.html","/reset-password.html",
 "/style.css","/responsive.css","/responsive-fixes.css","/mobile-stability.css","/mobile-chat-layout.css","/global-theme.css","/navigation.css","/modern-chat-icons.css","/voice-call-modern.css",
 "/navigation.js","/app-stability.js","/performance-cutover.js","/app.js","/legacy-app.js","/app-fixes.js","/feature-bootstrap.js","/features/page-adapter.js","/core/app-runtime.js","/core/bootstrap.js","/core/session-coordinator.js","/core/presence-coordinator.js","/core/presence-ui.js","/core/service-registry.js","/core/app-state.js",
 "/chats-whatsapp.js","/chat-instant-cache.js","/chat-full-cache.js","/chat-scroll-fix.js","/message-render-atomic.js","/send-dedupe.js","/voice-note.js","/voice-call-screen.js","/voice-call-webrtc.js","/live-call-v2.js","/live-call-caller-v2.js","/call-navigation-shell.js","/push-notifications.js","/manifest.json","/favicon.svg"
];
const sameOrigin=u=>u.origin===self.location.origin;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(async c=>{for(const url of SHELL){try{const r=await fetch(url,{cache:'no-store'});if(r.ok)await c.put(url,r)}catch(_){}}}).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('she-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))));
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);if(!sameOrigin(url))return;
 e.respondWith((async()=>{const cached=await caches.match(req);try{const net=await fetch(req);if(net.ok){const c=await caches.open(CACHE);c.put(req,net.clone()).catch(()=>{});}return net}catch(_){if(cached)return cached;if(req.mode==='navigate')return (await caches.match('/chats.html'))||new Response('Offline',{status:503});return new Response('',{status:503})}})())
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
