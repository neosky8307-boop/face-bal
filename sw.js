// 얼굴 균형 셀프 체크 - Service Worker
// 앱 껍데기(HTML/아이콘)는 설치 때 저장하고, 얼굴 인식 라이브러리와 모델(CDN)은 처음 사용할 때 저장해서
// 그 뒤로는 오프라인에서도 동작해요. 앱 파일을 바꿨다면 VERSION 숫자를 올려주세요.
const VERSION = "v1";
const SHELL = `fb-shell-${VERSION}`;
const RUNTIME = `fb-runtime-${VERSION}`;
const SHELL_FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
];
const CDN_HOSTS = ["cdn.jsdelivr.net", "storage.googleapis.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(cacheFirst(req));
  } else if (url.origin === location.origin) {
    e.respondWith(req.mode === "navigate" ? networkFirst(req) : staleWhileRevalidate(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(RUNTIME);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req, { ignoreSearch: true })) ||
           (await cache.match("index.html")) ||
           (await cache.match("./")) ||
           Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(SHELL);
  const hit = await cache.match(req, { ignoreSearch: true });
  const fresh = fetch(req)
    .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return hit || (await fresh) || Response.error();
}
