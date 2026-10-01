const CACHE="xpress-v5-5";
const FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Network-first: always try the latest version, fall back to cache when offline
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(res=>{
    if(res&&res.ok&&(new URL(e.request.url).origin===location.origin||/fonts\.(googleapis|gstatic)\.com/.test(e.request.url))){
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return res;
  }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match("./index.html"))));
});
