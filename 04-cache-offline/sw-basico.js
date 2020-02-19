self.addEventListener( 'fetch', event => {

	/*const offlineResp = new Response( `
	Bienvenido a mi página web.
	Para poder usarla necesitas internet
	` );*/

	const offlineResp = fetch('pages/offline.html');

	const resp = fetch( event.request ).catch( () => offlineResp);

	event.respondWith( resp );
} );


