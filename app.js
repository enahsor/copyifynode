const express = require('express')
const http = require('http')
const path = require('path')
const fileSystem = require('fs')
const cors = require('cors')
const socketStream = require('socket.io-stream')


const app = express()
const api = express()
const PORT =  process.env.PORT || 9000

const server = http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    const stream = socketStream.createStream()
    socket.on('track', (trackid) => {
        const filePath = path.resolve(__dirname, './private', `./${trackid}.ogg`)

        //get file info
        const stat = fileSystem.statSync(filePath)
        const readStream = fileSystem.createReadStream(filePath)

        readStream.pipe(stream)
        socketStream(socket).emit('track-stream', stream, {stat})
    })

    

    
})

app.use(cors())

api.get('/', (req, res) => {
    res.send('THIS IS A TEST SERVER.')
})
 
api.get('/song/:id', (req, res) => {
    // generate file path
    const filePath = path.resolve(__dirname, './private', `./${req.params.id}.ogg`)

    //get file size info
    const stat = fileSystem.statSync(filePath)

    //set response headers
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    })
    console.log(`File size is ${stat.size}`)
    
    //create read stream
    const readStream = fileSystem.createReadStream(filePath)
    
    // attach this stream with response stream

    readStream.pipe(res)
})

app.use('/', api)


server.listen(PORT, () => {
    console.log(`Server started on port *:${PORT}`)
})