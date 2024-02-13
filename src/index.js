import express from 'express'
import productRouter from './routes/productRouter.js'
import upload from './config/multer.js'
import {__dirname} from './path.js'
import cartRouter from './routes/cartRouter.js'

//Configuraciones
const app = express()
const PORT = 8080

//Middlewares
app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))

//Routes
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/upload', upload.single('product'), (req, res) =>{
    try {
        res.status(200).send("Imagen cargada correctamente ")
    } catch (error) {
        res.status(500).send("Error al cargar imagen")
    }
})

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})