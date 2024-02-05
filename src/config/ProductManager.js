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