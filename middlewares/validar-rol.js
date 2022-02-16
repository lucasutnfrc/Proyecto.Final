const {response, request} = require('express')

//valor en true --> Admin
//valor en false --> Usuario
const flagAdmin = true;

const validarRolAdmin = (req = request, res = response, next) => {

    if (!flagAdmin) {
        return res.status(400).json({
            error: -1,
            descripcion: `Ruta ${req.originalUrl}, Método ${req.method} no autorizados`
        })
    };

    next();

};

module.exports = {
    validarRolAdmin
}