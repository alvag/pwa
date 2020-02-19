
// Ciclo de vida del SW

self.addEventListener('install', event => {
	console.log('SW: Instalando SW');
});

self.addEventListener('activate', event => {
	// borrar cache
	console.log('SW: Activo y listo');
});

self.addEventListener('fetch', event => {
	// aplicar estrategias de cache
	// console.log('SW:', event.request.url);

	/*if (event.request.url.includes('https://reqres.in/')) {
		const resp = new Response(`{ok: false, mensaje: 'Mi mensaje'}`)
		event.respondWith(resp);
	}*/
});

// SYNC: Cuando recuperamos la conexión a internet
self.addEventListener('sync', event => {
	console.log('Tenemos conexión');
	console.log(event);
	console.log(event.tag);
});


// PUSH: Manejar las notificaciones push
self.addEventListener('push', event => {
	console.log('Notificación recibida!');
	console.log(event);
});
