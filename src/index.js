const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath));

io.on('connection', () => {
    console.log('New Websocket Connection!');
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})