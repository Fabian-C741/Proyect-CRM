import type { NextApiRequest, NextApiResponse } from 'next'

const sw = `self.__uvs=self.__uvs||[];self.__uvs.push('crm-v2')
self.addEventListener('install',(e)=>{e.waitUntil(caches.open('crm-v2').then((c)=>c.addAll(['/','/offline'])));self.skipWaiting()})
self.addEventListener('fetch',(e)=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then((r)=>r||caches.match('/offline'))))})
self.addEventListener('activate',(e)=>{e.waitUntil(caches.keys().then((k)=>Promise.all(k.filter((n)=>n!=='crm-v2').map((n)=>caches.delete(n)))))})
`

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
  res.setHeader('Service-Worker-Allowed', '/')
  res.status(200).send(sw)
}
