const express = require('express')
const http = require('http')
const path = require('path')
const fileSystem = require('fs')
const cors = require('cors')

const app = express()
const api = express()
const PORT = 9000


app.use(cors())
 
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

const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`Server started on port *:${PORT}`)
})