const express = require('express')
const http = require('http')
const path = require('path')
const fileSystem = require('fs')
const cors = require('cors')




const app = express()
const api = express()
const PORT =  process.env.PORT || 9000

const server = http.createServer(app)


app.use(cors())
app.use(express.json())

api.get('/track/:trackid', (req, res) => {
    
    const trackid = req.params.trackid
    const filePath = path.resolve(__dirname, `./private`, `./${trackid}.mp3`)
    const stat = fileSystem.statSync(filePath)

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    })
    
    
    const readStream = fileSystem.createReadStream(filePath)

    readStream.pipe(res)
})

api.get('/', (req, res) => {
    res.send('<h2>Server is running</h2>')
})
 

app.use('/', api)


server.listen(PORT, () => {
    console.log(`Server started on port *:${PORT}`)
})