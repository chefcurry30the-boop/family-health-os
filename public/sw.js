const CACHE_NAME = "nova-health-os-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/register-sw.js",
  "/icon-192.svg",
  "/icon-512.svg",
];

// Emergency data to cache offline
const EMERGENCY_DATA = {
  bloodType: "O+",
  allergies: ["None known"],
  conditions: ["Hypertension (2021)", "Mild Sleep Apnea (2023)"],
  medications: ["Lisinopril 10mg — Daily morning"],
  contacts: [
    { name: "Sarah Mitchell", phone: "(555) 234-5678", relation: "Spouse" },
    { name: "Dr. Patel", phone: "(555) 890-1234", relation: "Doctor" },
    { name: "Methodist Hospital", phone: "(555) 911-0000", relation: "Hospital" },
  ],
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        if (url.pathname.includes("/api/emergency")) {
          return new Response(JSON.stringify(EMERGENCY_DATA), {
            headers: { "Content-Type": "application/json" },
          });
        }
        return caches.match(request);
      })
    );
    return;
  }

  // Cache-first for static assets (HTML, JS, CSS, SVG, fonts)
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
