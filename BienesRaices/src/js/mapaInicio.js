(function(){

    const lat = 6.2755597;
    const lng = -75.5677816;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    const filtros = {
        categoria: '',
        precio: ''
    }

    const catSelect = document.querySelector('#categorias')
    const preSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Filtrado de Categorias y precios
    catSelect.addEventListener('change', e => {
        filtros.categoria= +e.target.value
        filtrarPropiedades();
    })

    preSelect.addEventListener('change', e => {
        filtros.precio= +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        // Limpiar los markers (pines) previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            // Agragar los pines para cada propiedad     
            const marker = new L.marker([propiedad?.latitud, propiedad?.longitud], {
                autoPan: true
            }).addTo(mapa)
              .bindPopup(`
                    <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
                    <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                    <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
                    <a href="/propiedad/${propiedad?.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase"> Ver Propiedad </a>
              `)
            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarPorCategoria ).filter( filtrarPorPrecio )
        mostrarPropiedades(resultado)
        console.log(resultado)
    }

    const filtrarPorCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    const filtrarPorPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad

    // const filtrarPorCategoria = (propiedad) => {
    //     return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    // }

    obtenerPropiedades()
})()