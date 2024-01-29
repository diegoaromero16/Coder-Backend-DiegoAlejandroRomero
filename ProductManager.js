import crypto from 'crypto'
import fs from 'fs';
import { title } from 'process';

class ProductManager {
    constructor() {
        this.RUTA = "./Productos.json"
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
    addProduct = (title, description, price, thumbnail, code, stock) => {
        //Validacion todos los campos completos
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Todos los campos son obligatorios";
        }
        const producto = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: crypto.randomBytes(10).toString('hex')
        };
        // Validar que no se repita el id
        const existingIndex = this.products.findIndex(product => product.id === producto.id);

        if (existingIndex === -1) {
            this.products.push(producto);
        }
        else {
            this.products[existingIndex].stock += producto.stock
        }
        this.saveProducts();
        return "Producto agregado exitosamente";

    }
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.RUTA, "utf-8");
            console.log(JSON.parse(data))
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
            console.log(productoBuscado)
            return productoBuscado
        }
        else {
            console.log("No encontrado")
            return "No encontrado"
        }
    }
    deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return "Producto eliminado exitosamente";
        } else {
            return "Producto no encontrado";
        }
    }
    updateProduct = (productId, campoActualiza, valorActualiza) => {
        const index = this.products.findIndex(product => product.id === productId);
        if (index != -1) {
            const productoActualizar = this.products[index];
            if (campoActualiza in productoActualizar) {
                productoActualizar[campoActualiza] = valorActualiza;
                this.saveProducts();
                return "Producto actualizado con exito";
            }
            else {
                return "El campo especificado no existe en el producto";
            }
        }
        else {
            return "Producto no encontrado";
        }
    }
}

const productManager = new ProductManager();

// console.log(productManager.addProduct("producto prueba2", "Este es un producto prueba2", 500, "Sin imagen", "abc123", 75));
//console.log(productManager.getProductById("5bed97c0ed13a05df00h"));
// console.log(productManager.getProducts());
console.log(productManager.deleteProduct("5bed97c0ed13a05df00d"))
// console.log(productManager.updateProduct("f59886bac182e3d5a83a", "title", "producto prueba update"));