import crypto from 'crypto'
import fs from 'fs';
import { title } from 'process';

export class ProductManager {
    constructor() {
        this.RUTA = "src/data/Productos.json"
        this.products = this.loadProducts()
    }
    loadProducts = () => {
        try {
            const data = fs.readFileSync(this.RUTA, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o está vacío, retorna un arreglo vacío.
            return [];
        }
    }
    saveProducts = async () => {
        await fs.promises.writeFile(this.RUTA, JSON.stringify(this.products));
    }
    addProduct = (newProduct) => {
        //Validacion todos los campos completos
        if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock) {
            return "Todos los campos son obligatorios";
        }
        if(typeof newProduct.title !== "string" || typeof newProduct.description !== "string" || typeof newProduct.price !== "number" || typeof newProduct.thumbnail !== "string" || typeof newProduct.code !== "string" || typeof newProduct.stock !== "number"){
            return "Tipo de dato incorrecto"
        }
        // Validar que no se repita el id
        const existingIndex = this.products.findIndex(product => product.id === newProduct.id);

        if (existingIndex === -1) {
            newProduct.id = crypto.randomBytes(10).toString('hex')
            newProduct.status = true
            if(!newProduct.thumbnail)
                newProduct.thumbnail = []
            this.products.push(newProduct);
        }
        else {
            this.products[existingIndex].stock += newProduct.stock
        }
        this.saveProducts();
        return "Producto agregado exitosamente";
    }
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.RUTA, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return []; // En caso de error, retorna un arreglo vacío
        }
    }
    getProductById = async (productId) => {
        const productos = JSON.parse(await fs.promises.readFile(this.RUTA, "utf-8"))
        const productoBuscado = productos.find(product => product.id === productId)
        if (productoBuscado != undefined) {
            return productoBuscado
        }
        else {
            return "Producto no existente"
        }
    }
    async deleteProduct(id) {
        const prods = JSON.parse(await fs.promises.readFile(this.RUTA, 'utf-8'))
        const existingIndex = prods.findIndex(producto => producto.id === id)
        if (existingIndex != -1) {
            const prodsFiltrados = prods.filter(prod => prod.id != id)
            await fs.promises.writeFile(this.RUTA, JSON.stringify(prodsFiltrados))
            return 'Producto eliminado correctamente'
        } else {
            return 'Producto no existe'
        }

    }
    async updateProduct(id, nuevoProducto) {
        const prods = JSON.parse(await fs.promises.readFile(this.RUTA, "utf-8"));
        const existingIndex = prods.findIndex(producto => producto.id === id)
        if (existingIndex != -1) {
            if(nuevoProducto.id != null){
                return "No se puede actualizar el id del producto"
            }
            prods[existingIndex].title = nuevoProducto.title
            prods[existingIndex].description = nuevoProducto.description
            prods[existingIndex].price = nuevoProducto.price
            prods[existingIndex].thumbnail = nuevoProducto.thumbnail
            prods[existingIndex].code = nuevoProducto.code
            prods[existingIndex].stock = nuevoProducto.stock
            await fs.promises.writeFile(this.RUTA, JSON.stringify(prods))
            return 'Producto actualizado correctamente'
        } else {
            return 'Producto no existe'
        }

    }
}

const productManager = new ProductManager();