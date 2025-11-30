// Service Worker para PWA - SGM Bancario
const CACHE_NAME = 'sgm-bancario-v1.0.0'
const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/vite.svg'
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...')
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache abierto')
                return cache.addAll(urlsToCache)
            })
            .catch((error) => {
                console.error('Service Worker: Error al cachear archivos', error)
            })
    )
    self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activado')
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando cache antiguo:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
    self.clients.claim()
})

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retornar respuesta del cache si existe
                if (response) {
                    return response
                }

                // Si no está en cache, hacer petición a la red
                return fetch(event.request)
                    .then((response) => {
                        // No cachear respuestas que no sean exitosas
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response
                        }

                        // Clonar la respuesta para poder usarla y cachearla
                        const responseToCache = response.clone()

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache)
                            })

                        return response
                    })
                    .catch((error) => {
                        console.error('Service Worker: Error en fetch', error)
                        // En caso de error de red, intentar servir página offline básica
                        if (event.request.destination === 'document') {
                            return caches.match('/')
                        }
                    })
            })
    )
})

// Manejar notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push recibido', event)

    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación de SGM Bancario',
        icon: '/vite.svg',
        badge: '/vite.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalles',
                icon: '/vite.svg'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/vite.svg'
            }
        ]
    }

    event.waitUntil(
        self.registration.showNotification('SGM Bancario', options)
    )
})

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notificación clickeada', event)

    event.notification.close()

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/dashboard')
        )
    }
})

// Sincronización en background (para futuras implementaciones)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Sincronización en background', event)

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync())
    }
})

async function doBackgroundSync() {
    // Implementar sincronización de datos en background
    console.log('Service Worker: Ejecutando sincronización en background')
}