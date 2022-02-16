const {Router} = require('express');
const { createCarrito, deleteCarrito, getProductosCarrito, pushProductoCarrito, deleteProductoCarrito } = require('../controllers/carritos');


const router = Router();


router.post( '/', createCarrito );
router.delete( '/:id', deleteCarrito);
router.get( '/:id/productos', getProductosCarrito);
router.post( '/:id/productos/:idProducto', pushProductoCarrito);
router.delete( '/:id/productos/:idProducto', deleteProductoCarrito);



module.exports = router;

