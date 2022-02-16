const {Router} = require('express');

const { getProductos, getProducto, createProducto, updateProducto, deleteProducto } = require('../controllers/productos');
const { validarRolAdmin } = require('../middlewares/validar-rol');


const router = Router();


router.get( '/', getProductos );
router.get( '/:id', getProducto);
router.post( '/', [validarRolAdmin], createProducto);
router.put( '/:id', [validarRolAdmin], updateProducto);
router.delete( '/:id', [validarRolAdmin], deleteProducto);

module.exports = router;