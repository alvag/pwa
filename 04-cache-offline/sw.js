const CACHE_NAME = 'cache-v1';
const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_DYNAMIC_LIMIT = 50;

function clearCache( cacheName, numItems ) {
	caches.open( cacheName )
	.then( cache => {
		cache.keys().then( keys => {
			if ( keys.length > numItems ) {
				cache.delete( keys[ 0 ] ).then( () => clearCache( cacheName, numItems ) );
			}
		} );
	} );
}

self.addEventListener( 'install', e => {

	const cacheStatic = caches.open( CACHE_STATIC_NAME )
	.then( cache => cache.addAll( [
			'/',
			'/index.html',
			'/css/style.css',
			'/img/main.jpg',
			'/img/no-img.jpg',
			'/js/app.js'
		] )
	);

	e.waitUntil( cacheStatic );

	const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
	.then( cache => cache.addAll( [
			'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
		] )
	);

	e.waitUntil( Promise.all( [cacheStatic, cacheInmutable] ) );
} );

self.addEventListener( 'fetch', e => {
	// 1) Cache only
	// e.respondWith(caches.match(e.request));

	// 2) Cache with network fallback
	/*const cacheRes = caches.match( e.request )
	 .then( res => {
	 if ( res ) {
	 return res;
	 }

	 return fetch( e.request )
	 .then( newRes => {
	 caches.open( CACHE_DYNAMIC_NAME ).then( cache => {
	 if ( !/^https?:$/i.test( new URL( e.request.url ).protocol ) ) return;
	 cache.put( e.request, newRes );
	 clearCache( CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT );
	 } );

	 return newRes.clone();
	 } );
	 } );

	 e.respondWith( cacheRes );*/

	// 3) Network with cache fallback
	/*const res = fetch( e.request ).then( res => {
	 if (!res) return caches.match(e.request);

	 caches.open(CACHE_DYNAMIC_NAME)
	 .then(cache => {
	 cache.put(e.request, res);
	 clearCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT)
	 });
	 return res.clone();
	 } ).catch(err => {
	 return caches.match(e.request);
	 });

	 e.respondWith(res);*/

	// 4) Cache with network update
	/*if (e.request.url.includes('bootstrap')) {
	 return e.respondWith(caches.match(e.request));
	 }

	 const res = caches.open( CACHE_STATIC_NAME ).then( cache => {
	 fetch( e.request ).then( newRes => cache.put( e.request, newRes ) );

	 return cache.match( e.request );
	 } );

	 e.respondWith( res );*/

	// 5) Cache & Network Race
	const res = new Promise( ( resolve, reject ) => {
		let rejected = false;

		const failedOnce = () => {
			if ( rejected ) {
				if (/\.(png|jpg)$/i.test(e.request.url)) {
					resolve(caches.match('/img/no-img.jpg'))
				} else {
					reject('No se encontró respuesta');
				}
			} else {
				rejected = true;
			}
		};

		fetch( e.request ).then( res => {
			res.ok ? resolve( res ) : failedOnce();
		} ).catch( failedOnce );

		caches.match( e.request ).then( res => {
			res ? resolve( res ) : failedOnce();
		} ).catch( failedOnce );
	} );

	e.respondWith( res );
} );

