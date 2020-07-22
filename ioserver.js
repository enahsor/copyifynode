const ss = require('socket.io-stream')
const io = require('socket.io')


module.exports = function(server, path, fs){

    

    const bi = io(server)

    bi.on('connection', (socket) => {
        console.log('An instance has connected')
    
        socket.on('send-track', (trackid) => {
            const stream = ss.createStream()
            console.log(`Instance requested track ${trackid}`)
            const filePath = path.resolve(__dirname, './private/', `./${trackid}.mp3`)
            const stat = fs.statSync(filePath)

            const readStream = fs.createReadStream(filePath)
            
            readStream.pipe(stream)
            console.log(`Sending track ${trackid} to instance`)            
            ss(socket).emit('sending', (stream), {stat})
        })
    
        socket.on('disconnect', () => {
            console.log('An instance disconnected')
        })
    })
}   