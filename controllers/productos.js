const { response, request } = require('express');
const fs = require('fs');


const getProductos = async(req, res = response) => {

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido)
        res.status(200).json({
            status: 'OK',
            productos: productos.length > 0 ? productos : 'No hay productos'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador'
        })
    }

};

const getProducto = async(req =  request, res = response) => {

    const id = req.params.id;

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);

        const producto = await productos.find(prod => {
            return prod.id == id
        })

        console.log(producto);

        res.status(200).json({
            ok: true,
            producto: producto ? producto : 'Producto no encontrado'
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador'
        })
    }

};

const createProducto = async(req =  request, res = response) => {
    const newProduct = req.body;

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);
        if (productos.length > 0) {
            const id = productos[productos.length - 1].id + 1
            newProduct['id'] = id;
            
        } else {
            const id = 1;
            newProduct['id'] = id;
        }
        newProduct['timestamp'] = Date.now()
        productos.push(newProduct);
        console.log(productos);

        await fs.promises.writeFile('productos.json', JSON.stringify(productos, null, 2));

        res.status(200).json({
            ok: true,
            msg: 'Producto agragado con éxito',
            productos: productos
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }
};

const deleteProducto = async(req =  request, res = response) => {
    const id = req.params.id

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);

        const posicion = await productos.findIndex(prod => {
            return prod.id == id
        });

        console.log(posicion);

        if (posicion >= 0) {
            await productos.splice(posicion, 1);
            console.log(productos);
            await fs.promises.writeFile('productos.json', JSON.stringify(productos, null, 2));
            res.status(200).json({
                ok: true,
                msg: 'Producto borrado con exito',
                productos: productos.length ? productos : 'No quedan productos guardados'
            })
            
        } else {
            res.status(200).json({
                ok: true,
                msg: 'No existe el producto que desea borrar'
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

const updateProducto = async(req =  request, res = response) => {
    console.log(req.params, req.body);
    const id = req.params.id;
    const update = req.body;

    try {
        const contenido = await fs.promises.readFile('productos.json', 'utf-8');
        const productos = await JSON.parse(contenido);

        const posicion = await productos.findIndex(prod => {
            return prod.id == id
        });

        if (posicion >= 0) {
            productos[posicion].nombre = update.nombre;
            productos[posicion].descripcion = update.descripcion;
            productos[posicion].codigo = update.codigo;
            productos[posicion].foto = update.foto;
            productos[posicion].precio = update.precio;
            productos[posicion].stock = update.stock;
            await fs.promises.writeFile('productos.json', JSON.stringify(productos, null, 2));

            res.status(200).json({
                ok: true,
                msg: 'Producto editado con exito',
                producto: productos[posicion]
            })

        } else {
            res.status(200).json({
                ok: true,
                msg: 'No existe el producto que desea editar'
            })
        }
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el Administrador',
            error: error
        })
    }


    /* res.json({
        ok:true,
        msg: 'OK update'
    }) */
};



module.exports = {
    getProductos,
    getProducto,
    createProducto,
    deleteProducto,
    updateProducto
}