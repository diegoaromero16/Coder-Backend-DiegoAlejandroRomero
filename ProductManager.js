import crypto from 'crypto'

class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        //Validacion todos los campos completos
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Todos los campos son obligatorios";
        }

        // Validar que no se repita el campo "code"
        const existingProduct = this.products.find(product => product.code === code);


        if (existingProduct) {
            return "Producto ya existente"
        }
        else {
            const producto = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: crypto.randomBytes(10).toString('hex')
            };
            this.products.push(producto)
            return "Producto agregado exitosamente"
        }
    }
    getProducts() {
        return this.products;
    }
    getProductById(productId){
        const productoBuscado = this.products.find(product => product.id === productId)

        if(productoBuscado){
            return productoBuscado
        }
        else{
            return "Not Found"
        }
    }
}

const productManager = new ProductManager();

console.log(productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25));
console.log(productManager.getProducts())