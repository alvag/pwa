// indexedDB: Reforzamiento

let req = window.indexedDB.open( 'my-db', 1 );

// Actualiza cuando se crea o se sube de version la DB

req.onupgradeneeded = event => {
	console.log( 'Actualización de BD' );

	let db = event.target.result;

	db.createObjectStore( 'heroes', {
		keyPath: 'id'
	} );
};


// Manejo de errores
req.onerror = event => {
	console.log( 'Db error:', event.target.error );
};

// insertar datos
req.onsuccess = event => {
	let db = event.target.result;

	let heroesData = [
		{ id: 1, heroe: 'Spiderman', mensaje: 'Yo soy Spiderman' },
		{ id: 2, heroe: 'Superman', mensaje: 'Yo soy Superman' },
		{ id: 3, heroe: 'Batman', mensaje: 'Yo soy Batman' },
	];
	let heroesTransaction = db.transaction( 'heroes', 'readwrite' );

	heroesTransaction.onerror = event => {
		console.log( 'Error al guardar:', event.target.error );
	};

	heroesTransaction.oncomplete = event => {
		console.log( 'Transacción realizada:', event );
	};

	let heroesStore = heroesTransaction.objectStore('heroes');

	for (let heroe of heroesData ) {
		heroesStore.add(heroe);
	}

	heroesStore.onsucces = event => {
		console.log('Nuevo item agregado a la base de datos');
	}
};
