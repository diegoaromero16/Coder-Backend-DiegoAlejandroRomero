import { Router } from "express";
import { CartManager } from "../config/CartManager.js";

const cartRouter = Router();
const cartManager = new CartManager('./src/data/Carrito.json')

cartRouter.get('/', async (req, res) => {
    try {
        const mensaje = await cartManager.getCart()
        res.status(200).send(mensaje)
    } catch (error) {

    }
})
cartRouter.post('/', async (req, res) => {
    try {
        const products = req.body
        const mensaje = await cartManager.addCart(products);

        if (mensaje == "Agregado correctamente al carrito") {
            res.status(200).send(mensaje)
        }
        else if (mensaje == "Ingrese productos al carrito") {
            res.status(404).send(mensaje)
        }
        else {
            res.status(400).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error del servidor al intentar guardar el carrito: ${error}`)
    }
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid
        const prodCart = await cartManager.getCartById(idCart);

        if (prodCart === "") {
            res.status(200).send(prodCart);
        }
        else {
            res.status(400).send(prodCart)
        }
    } catch (error) {
        res.status(500).send(`Error del servidor al buscar el carrito ${error}`)
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const idCart = req.params.cid
        const prodCartId = req.params.pid
        const { quantity } = req.body

        const mensaje = await cartManager.addProductCart(idCart, prodCartId, quantity)

        if (mensaje == "Producto cargado correctamente") {
            res.status(200).send(mensaje)
        }
        else {
            res.status(400).send(mensaje)
        }
    } catch (error) {
        res.status(500).send(`Error del servidor al agregar producto al carrito ${error}`)
    }

})
export default cartRouter