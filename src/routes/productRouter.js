import { Router } from "express";
import { ProductManager } from '../config/ProductManager.js'

const productRouter = Router()
const productManager = new ProductManager('../src/data/Productos.json')

productRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query
        const prods = await productManager.getProducts()
        if (!limit) {
            // Si no se especifica ningún límite, se devuelven todos los productos
            res.send(prods);
        } else {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                if (limitNum > 0) {
                    const prodsLimit = prods.slice(0, limitNum);
                    res.send(prodsLimit);
                }
                else {
                    // Si se especifica un límite inválido o menor o igual a 0, se devuelve un mensaje de error
                    res.status(400).send("Ingrese un número mayor a 0 como límite");
                }
            } else {
                res.status(400).send("No se permiten letras como límite");
            }
        }
    }
    catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el cliente: ${error}`)
    }
})
productRouter.get('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const prod = await productManager.getProductById(idProducto)
        if (prod) {
            res.status(200).send(prod)
        }
        else {
            res.status(404).send("EL producto no existe.")
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el producto: ${error}`)
    }
})
productRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const mensaje = await productManager.addProduct(product);
        if (mensaje == "Producto agregado exitosamente") {
            res.status(200).send(mensaje);
        }
        else if (mensaje == "Tipo de dato incorrecto") {
            res.status(404).send(mensaje)
        }
        else {
            res.status(400).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el producto: ${error}`)
    }
})
productRouter.put('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const updateProduct = req.body
        const mensaje = await productManager.updateProduct(idProducto, updateProduct)

        if (mensaje == "Producto actualizado correctamente") {
            res.status(200).send(mensaje)
        }
        else if (mensaje == "No se puede actualizar el id del producto"){
            res.status(403).send(mensaje)
        }
        else {
            res.status(400).send(mensaje)
        }

    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el producto: ${error}`)
    }
})

productRouter.delete('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const mensaje = await productManager.deleteProduct(idProducto)

        if (mensaje == "Producto eliminado correctamente") {
            res.status(200).send(mensaje)
        }
        else {
            res.status(400).send(mensaje)
        }

    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar el producto: ${error}`)
    }
})

export default productRouter