const esVendedor = (usuarioId, propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId
}

const formatFecha = fecha => {
    //console.log(new Date(fecha).toISOString()) // 2022-08-11T18:24:27.000Z
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10) // 2022-08-11

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
}

export {
    esVendedor,
    formatFecha
}