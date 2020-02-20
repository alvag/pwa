const CACHE_STATIC_NAME = 'static-v3';
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
			'/js/app.js',
			'/pages/offline.html'
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

self.addEventListener( 'activate', e => {
	const res = caches.keys().then( keys => {
		keys.forEach( key => {
			if ( key !== CACHE_STATIC_NAME && key.includes('static') ) {
				return caches.delete( key );
			}
		} );
	} );

	e.waitUntil( res );
} );

self.addEventListener( 'fetch', e => {
	// 2) Cache with network fallback
	const cacheRes = caches.match( e.request )
	.then( res => {
		if ( res ) {
			return res;
		}

		return fetch( e.request ).then( newRes => {
			caches.open( CACHE_DYNAMIC_NAME ).then( cache => {
				if ( !/^https?:$/i.test( new URL( e.request.url ).protocol ) ) return;
				cache.put( e.request, newRes );
				clearCache( CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT );
			} );

			return newRes.clone();
		} ).catch( err => {
			if ( e.request.headers.get( 'accept' ).includes( 'text/html' ) ) {
				return caches.match( '/pages/offline.html' );
			}
		} );
	} );

	e.respondWith( cacheRes );
} );
