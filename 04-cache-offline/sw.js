const CACHE_NAME = 'cache-v1';
const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

self.addEventListener( 'install', e => {

	const cacheStatic = caches.open( CACHE_STATIC_NAME )
	.then( cache => cache.addAll( [
			'/',
			'/index.html',
			'/css/style.css',
			'/img/main.jpg',
			'/js/app.js'
		] )
	);

	e.waitUntil( cacheStatic );

	const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
	.then( cache => cache.addAll( [
			'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
		] )
	);

	e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );
} );

self.addEventListener( 'fetch', e => {
	// Cache only
	// e.respondWith(caches.match(e.request));

	// Cache with network fallback
	const cacheRes = caches.match( e.request )
	.then( res => {
		if ( res ) {
			return res;
		}

		return fetch( e.request )
		.then( newRes => {
			caches.open( CACHE_DYNAMIC_NAME ).then( cache => {
				if (!/^https?:$/i.test(new URL(e.request.url).protocol)) return;
				cache.put( e.request, newRes );
			} );

			return newRes.clone();
		} );
	} );

	e.respondWith( cacheRes );
} );
