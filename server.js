const express = require('express')
const app = express()

// const fetch = require('node-fetch')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static('static'))

http.listen(process.env.PORT || 3000)

app.get('/', open)

function open(req, res) {
  res.render('index.ejs')
}

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
    console.log(socket.server.sockets.sockets) // door het socket object heen gespit op zoek naar nog actieve sockets
  });
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});