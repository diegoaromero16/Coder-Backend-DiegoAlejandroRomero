import { json } from 'express';
import fs from 'fs'
import crypto from 'crypto'

export class CartManager {
    constructor() {
        this.RUTA = "src/data/Carrito.json"
        this.cart = this.loadCart()
    }
    loadCart = () => {
        try {
            const data = fs.readFileSync(this.RUTA, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o está vacío, retorna un arreglo vacío.
            return [];
        }
    }
    saveCart = async () => {
        await fs.promises.writeFile(this.RUTA, JSON.stringify(this.cart))
    }
    getCart = () => {
        const cart = fs.readFileSync(this.products, 'utf-8')
        return cart;
    }
    addCart = (prodsCartArray) => {
        if (!prodsCartArray) {
            return "Ingrese productos al carrito"
        }
        else {
            const newCart = {
                id: crypto.randomBytes(10).toString('hex'),
                products: [prodsCartArray]
            }
            this.cart.push(newCart)
            this.saveCart();
            return "Agregado correctamente al carrito"
        }
    }
    getCartById = async (cartId) => {
        if (typeof cartId != "string") {
            return "Id de carrito incorrecto"
        }
        else {
            const carts = JSON.parse(await fs.promises.readFile(this.RUTA, 'utf-8'))
            const cart = carts.find(crts => crts.id === cartId)
            if (cart) {
                if (cart.products.length < 1) {
                    return "Carrito Vacio"
                }
                return cart.products
            }
            else {
                return "Carrito no encontrado"
            }
        }
    }
    addProductCart = async (idCarrito, idProducto, quantityProducto) => {
        try {

            const valido = this.addProductCartValidations(idCarrito, idProducto, quantityProducto)
            console.log(valido)

            if (valido !== "Todo OK")
                return valido
            // Buscar el carrito por su ID
            const cartIndex = this.cart.findIndex(cart => cart.id === idCarrito);

            if (cartIndex === -1) {
                // Si el carrito no existe, devolver un error
                return 'Carrito no encontrado';
            }

            // Verificar si el producto ya está en el carrito
            const productIndex = this.cart[cartIndex].products.findIndex(product => product.id === idProducto);
            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                this.cart[cartIndex].products[productIndex].stock += quantityProducto;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                this.cart[cartIndex].products.push({ id: idProducto, quantity: quantityProducto });
            }
            this.saveCart();
            return "Producto cargado correctamente";
        } catch (error) {
            // Si hay un error al leer el archivo, probablemente esté vacío, así que dejamos el carrito como un array vacío
            console.error("Error al leer el archivo de carrito:", error);
        }
    }

    addProductCartValidations(idCarrito, idProducto, quantityProducto) {
        if (idCarrito <= 0)
            return "Id carrito invalido"
        else if (idProducto <= 0 )
            return "Id Producto invalido"   
        else if (quantityProducto < 1 || typeof quantityProducto == "string") {
            return "Cantidad invalida"
        }
        else
            return "Todo OK"
    }
}
