
(function() {

    let zoom = 16;
    
    //Parque+Norte+Medellín/@6.2755597,-75.5677816,14z
    const lat = document.querySelector('#latitud').value || 6.2755597;
    const lng = document.querySelector('#longitud').value || -75.5677816;
    const mapa = L.map('mapa').setView([lat, lng ], zoom);
    let marker;

    // Utilizar Provider  y Geocoder
    const geoCodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Generar el pin para el mapa
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //Detectar el movimiento del PIN 
    marker.on('moveend', function(e){
        marker = e.target

        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        // Obtener la informacion de las calles
        geoCodeService.reverse().latlng(posicion, zoom).run(function(error, result) {
            marker.bindPopup(result.address.LongLabel)

            // Llenar los campos del formulario con los datos seleccionados en el mapa
            document.querySelector('.calle').textContent = result?.address?.Address ?? '';
            document.querySelector('#calle').value = result?.address?.Address ?? '';
            document.querySelector('#latitud').value = result?.latlng?.lat ?? '';
            document.querySelector('#longitud').value = result?.latlng?.lng ?? '';
        })
    })

})()