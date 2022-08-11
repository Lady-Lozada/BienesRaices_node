import { Dropzone } from 'dropzone'

//const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const token = document.querySelector('meta[name="csrf-token"]').content

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5, // 5 megas
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    // Los siguientes son eventos para modificar Dropzone
    init: function() {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })
    }
}