const socket = io()

socket.emit('movimiento', "Ca7")

socket.emit('finalizar', "Me he rendido")

socket.on('mensaje-jugador', info => {
    console.log(info)
})

socket.on('rendicion', info => {
    console.log(info)
})