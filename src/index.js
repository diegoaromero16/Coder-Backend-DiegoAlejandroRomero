import express from 'express'
import { ProductManager } from './config/ProductManager.js'


const app = express()
const PORT = 8080
const productManager = new ProductManager('./src/data/Productos.json')

app.get('/', (req, res) => {
    res.send("Hola desde servidor en express")
})
app.get('/products', async (req, res) => {
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
                res.send("Ingrese un número mayor a 0 como límite");
            }
        } else {
            res.send("No se permiten letras como límite");
        }
    }
})
app.get('/products/:pid', async (req, res) => {
    const idProducto = req.params.pid
    const prod = await productManager.getProductById(idProducto)
    res.send(prod)
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})