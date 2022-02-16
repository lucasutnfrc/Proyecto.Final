//Para probar el backend:
//npm install
//nodemon index.js

require('dotenv').config();
/* Modulos */
const bp = require('body-parser');
const express = require('express');
const { request  } = require('express');



/* Servidor de express */
const app = express();

//Lectura y parseo del body
app.use(express.json());

/* Middlewares */
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

//Rutas
app.use('/api/productos', require('./routes/productos'));
app.use('/api/carrito', require('./routes/carritos'));
app.use('*', (req = request, res) => {
    res.json({
        eror: -2,
        descripcion: `Ruta ${req.originalUrl}, Método ${req.method} no impmlementados`
    })
})



/* Servidor */
const server = app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});
server.on('error' , err => {
    console.log('Erros:', err);
})