const C='crm-maquilladora-v1'
const U=['/','/offline']
self.addEventListener('install',(e)=>{e.waitUntil(caches.open(C).then((c)=>c.addAll(U)));self.skipWaiting()})
self.addEventListener('fetch',(e)=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then((r)=>r||caches.match('/offline'))))})
