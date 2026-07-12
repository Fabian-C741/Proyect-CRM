export const dynamic = 'force-dynamic'

export async function GET() {
  const sw = `self.__uvs=self.__uvs||[];self.__uvs.push('crm-v1')
self.addEventListener('install',(e)=>{e.waitUntil(caches.open('crm-v1').then((c)=>c.addAll(['/','/offline'])));self.skipWaiting()})
self.addEventListener('fetch',(e)=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then((r)=>r||caches.match('/offline'))))})
self.addEventListener('activate',(e)=>{e.waitUntil(caches.keys().then((k)=>Promise.all(k.filter((n)=>n!=='crm-v1').map((n)=>caches.delete(n)))))})
`

  return new Response(sw, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
}
