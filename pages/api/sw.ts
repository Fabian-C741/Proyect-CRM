import type { NextApiRequest, NextApiResponse } from 'next'

const sw = `self.__uvs=self.__uvs||[];self.__uvs.push('crm-v3')
self.addEventListener('install',(e)=>{e.waitUntil(caches.open('crm-v3').then((c)=>c.addAll(['/offline'])));self.skipWaiting()})
self.addEventListener('activate',(e)=>{e.waitUntil(caches.keys().then((k)=>Promise.all(k.filter((n)=>n!=='crm-v3').map((n)=>caches.delete(n)))))})
self.addEventListener('fetch',(e)=>{
  if(e.request.method!=='GET')return
  const url=new URL(e.request.url)
  if(url.origin!==location.origin)return
  e.respondWith(
    fetch(e.request).catch(()=>{
      if(e.request.mode==='navigate')return caches.match('/offline')
      return caches.match(e.request).then((r)=>r||Response.error())
    })
  )
})
`

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
  res.setHeader('Service-Worker-Allowed', '/')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.status(200).send(sw)
}
