const {PythonShell} = require('python-shell')
const pyshell = new PythonShell('spacy-listen.py')
const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io');
const server = http.createServer(app)
const cors = require('cors');
app.use(cors()); // add this line

const io = socketio(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const { image_search } = require('duckduckgo-images-api')

server.listen(4000, () => {
  console.log('Spacy server listening on 4000')
})

io.on('connection', (socket) => {
  console.log('connection start')
  socket.on('message', (message) => {
    console.log(message)
    pyshell.send(message)
  })

  //recieve img request 
  socket.on('query', (query) => {  
    console.log("got request for query: ", query)  
    image_search({ 
      query: query, 
      moderate : true,   
      iterations : 1,
      retries  : 1
    }).then(function(res) {
      console.log(res[0])
      socket.emit('img', res[0])
    })
  })  

  pyshell.on('message', (message) => {
    console.log(message)
    socket.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('connection end')
  })
})