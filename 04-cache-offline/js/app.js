if ( navigator.serviceWorker ) {
	navigator.serviceWorker.register( '/sw.js' );
}

/*if (window.caches) {
    caches.open('cache-v1').then(cache => {
        // cache.add('/index.html');
        cache.addAll([
            '/index.html',
            '/css/style.css',
            '/img/main.jpg'
        ]);

        /!*cache.match('/index.html').then(res => {
            console.log(res);
        })*!/
    })
}*/
