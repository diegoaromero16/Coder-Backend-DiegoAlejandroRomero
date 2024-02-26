import express from 'express'
import productRouter from './routes/productRouter.js'
import upload from './config/multer.js'
import {__dirname} from './path.js'
import cartRouter from './routes/cartRouter.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

//Configuraciones
const app = express()
const PORT = 8080

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})

const io = new Server(server)

//Middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

io.on('connection', (socket) => {
    console.log('conexion con socket.io');

    socket.on('movimiento', info =>{
        console.log(info);
    })

    socket.on('finalizar', info => {
        console.log(info)

        //mensaje solo al cliente q envio el mensaje
        socket.emit('mensaje-jugador', "Te has rendido")

        //Mensaje a todas las conexiones con el servidor
        socket.broadcast.emit('rendicion', "El jugador se rindio")
    })
})

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', productRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.use('/upload', upload.single('product'), (req, res) =>{
    try {
        res.status(200).send("Imagen cargada correctamente ")
    } catch (error) {
        res.status(500).send("Error al cargar imagen")
    }
})

app.get('/static', (req, res) => {
    res.render('home')
})

