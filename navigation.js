/* She navigation v3: instant app-shell navigation with no transition wait. */
(()=>{
 'use strict';
 const routes={chats:'chats.html',calls:'calls.html',status:'status.html',contacts:'contacts.html'};
 const current=location.pathname.split('/').pop()||'chats.html';
 const key='she_nav_last_route';
 const routeFor=u=>Object.keys(routes).find(k=>routes[k]===u)||null;
 const markActive=()=>{const r=routeFor(current)||'chats';document.querySelectorAll('.bottom-nav .nav-item').forEach(b=>{b.classList.toggle('active',b.dataset.route===r);b.setAttribute('aria-current',b.dataset.route===r?'page':'false')})};
 const prefetch=url=>{if(!url||url===current)return;const href=new URL(url,location.href).href;if(document.querySelector(`link[rel="prefetch"][href="${href}"]`))return;const l=document.createElement('link');l.rel='prefetch';l.as='document';l.href=href;document.head.appendChild(l)};
 const go=url=>{if(!url||url===current)return;sessionStorage.setItem(key,url);document.documentElement.classList.add('nav-loading');location.replace(url)};
 window.SheNavigate=go;window.goTo=go;window.SheNav={routes,go,markActive};
 const init=()=>{document.querySelectorAll('.bottom-nav .nav-item').forEach((b,i)=>{const r=b.dataset.route||Object.keys(routes)[i];b.dataset.route=r;b.onclick=e=>{e.preventDefault();e.stopPropagation();go(routes[r])};b.addEventListener('pointerenter',()=>prefetch(routes[r]),{passive:true,once:true})});markActive();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 // Warm only the most likely next screens; never delay navigation.
 prefetch(routes.chats);prefetch(routes.contacts);
})();