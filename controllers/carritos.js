const { response, request } = require('express');
const fs = require('fs');


const createCarrito = async(req = request, res = response) => {

    const producto = req.body;
    const newCarrito = new Object;
    console.log(newCarrito);
    try {

        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);

        const contenidoCarrito = await fs.promises.readFile('carrito.json', 'utf-8');
        const carrito = await JSON.parse(contenidoCarrito);
        
        const existeProducto = await productos.some(prod => {
            return prod.id == producto.id
        });
        if (existeProducto) {
            
            if (carrito.length > 0) {
                const id = carrito[carrito.length - 1].id + 1;
                newCarrito['id'] = id;
            } else {
                newCarrito['id'] = 1;
            };
            newCarrito['timestamp'] = Date.now();
            newCarrito['productos'] = [];
            newCarrito.productos.push(producto);

            carrito.push(newCarrito)

            await fs.promises.writeFile('carrito.json', JSON.stringify(carrito, null, 2));


            res.json({
                ok:true,
                msg: 'Carrito creado con éxito',
                carrito: newCarrito
            });
    

        } else {
            res.json({
                ok:true,
                msg: 'Producto inexistente'
            });
    
        }

        

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }

    

};

const deleteCarrito = async(req = request, res = response) => {

    const id = req.params.id

    try {

        const contenido = await fs.promises.readFile('carrito.json', 'utf-8');
        const carritos = await JSON.parse(contenido);

        const posicion = await carritos.findIndex(carrito => {
            return carrito.id == id
        });

        if (posicion >= 0) {
            await carritos.splice(posicion, 1);
            console.log(carritos);
            await fs.promises.writeFile('carrito.json', JSON.stringify(carritos, null, 2));
            
            res.status(200).json({
                ok: true,
                msg: 'Carrito borrado con exito',
                carritos: carritos.length ? carritos : 'No quedan carritos guardados'
            })

        } else {
            res.status(200).json({
                ok: true,
                msg: 'No existe el carrito que desea borrar'
            })
        }
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }

};

const getProductosCarrito = async(req = request, res = response) => {

    const id = req.params.id

    try {
        
        const contenido = await fs.promises.readFile('carrito.json', 'utf-8');
        const carritos = await JSON.parse(contenido);

        const carrito = await carritos.find(cart => {
            return cart.id == id
        });

        res.status(200).json({
            ok: true,
            productosCarrito: carrito ? carrito.productos : 'Carrito no encontrado'
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }

};

const pushProductoCarrito = async(req = request, res = response) => {

    const idCarrito = req.params.id;
    const idProducto = req.params.idProducto;

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);

        const contenidoCarrito = await fs.promises.readFile('carrito.json', 'utf-8');
        const carritos = await JSON.parse(contenidoCarrito);

        const indexCarrito = await carritos.findIndex(cart => {
            return cart.id == idCarrito
        });

        if (indexCarrito < 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe el carrito con id: ' + idCarrito
            })
        };

        const indexProducto = await productos.findIndex(prod => {
            return prod.id == idProducto
        });

        if (indexProducto < 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe el producto con id: ' + idProducto
            })
        };

        carritos[indexCarrito].productos.push(productos[indexProducto]);

        await fs.promises.writeFile('carrito.json', JSON.stringify(carritos, null, 2));

        res.status(200).json({
            ok: true,
            msg: 'Producto agregado al carrito correctamente',
            carrito: carritos[indexCarrito]
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }

};

const deleteProductoCarrito = async(req = request, res = response) => {

    const idCarrito = req.params.id;
    const idProducto = req.params.idProducto;

    try {

        const contenidoCarrito = await fs.promises.readFile('carrito.json', 'utf-8');
        const carritos = await JSON.parse(contenidoCarrito);
        
        const indexCarrito = await carritos.findIndex(cart => {
            return cart.id == idCarrito
        });

        if (indexCarrito < 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe el carrito con id: ' + idCarrito
            })
        };

        if (carritos[indexCarrito].productos.length <= 0) {
            return res.status(200).json({
                ok: true,
                msg: 'El carrito no tiene productos'
            })
        }

        const indexProducto = await carritos[indexCarrito].productos.findIndex(prod => {
            return prod.id == idProducto
        });

        console.log(indexProducto);

        if (indexProducto < 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No existe el producto que quiere borarr en el carrito'
            })
        };

        await carritos[indexCarrito].productos.splice(indexProducto, 1);
        await fs.promises.writeFile('carrito.json', JSON.stringify(carritos, null, 2));


        res.status(200).json({
            ok: true,
            msg: 'Producto borrado del carrito correctamente',
            carrito: carritos[indexCarrito]
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }

}



module.exports = {
    createCarrito,
    deleteCarrito,
    getProductosCarrito,
    pushProductoCarrito,
    deleteProductoCarrito
}