//PROYECTO REALIZADO CON NODEJS, FRAMEWORK PUG Y EXPRESS


const express = require("express") -- Esta es la forma de importar propia de node

// En este importamos con ECMAScrip
import express from 'express' // Nativo de JavaScript

// Crear la app
const app = express()

// Routing
app.get('/nosotros', function(req, res){
    res.send('Información de nosotros')
})

router.route('/')
    .get(function(req, res){
        res.json({msg: 'Hola mundo en express'})
    })
    .post(function(req, res){
        res.json({msg: 'Respuesta de Tipo Post'})
    })
    
// Definir un puerto y arrancar el proyecto
const port = 3000

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})


// Template Engine
/**
 * Motores o plantillas que nos permiten crear código HTML y mostrar información 
 * contenida en variables de una forma mas compacta y clara
 * Pug, Handlebars, EJS
 * Tambien esposible usar React, Angular, Vue, etc...
 */


/*  instalar tailwind para css: npm i -D tailwindcss autoprefixer postcss postcss-cli
    Despues de configurar la carpeta publica con el archivo css, se debe ejecutar el siguiente comando en consola
    npx tailwindcss init -p
    Luego configurar el archivo tailwind.config.cjs qeu creo el comando anterior
*/

/* ORM
    npm i sequelize mysql 2
    npm i dotenv
*/

/* VALIDACIONES
    npm i express-validator
*/

/* ENCRYPTAR PASSWORD
    npm i bcrypt
*/

/* LIBRERIAS PARA EL ENVIO DE EMAIL
    Nodemailer(libreria) y Mailtrap(simular el envio de emails)
    npm i nodemailer
*/
/* LIBRERIA PARA HABILITAR EL CRSF y las cookies
    npm i csurf cookie-parser
*/
/* AUTENTICAR (passport, JWT o keycload)
    npm i jsonwebtoken
*/
/* INSTALAR Y CONFIGURAR WEB-PACK
    npm i -D webpack webpack-cli
*/
/* PARA EJECUTAR DIFRENTES COMANDO COMO CSS Y JS SIN NECESIDAD DE ABRIR VARIAS CONSOLAS
    POR QUE EN PACKAGE.JSON NO SE PUEDEN UNIFICAR
    npm i -D concurrently
*/
/* MANEJO DE IMAGENES v estable
    npm i dropzone@5.9.3
*/
/* INSTALAR LIBRERIA PARA SUBIR LAS IMAGENES
    npm i multer
*/

