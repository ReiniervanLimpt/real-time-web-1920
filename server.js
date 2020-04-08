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

io.on('connection', function(socket) { // de code die uitegvoerd wordt voor elke connectie/socket:

  socket.username = `anonymous`

  socket.broadcast.emit(`${socket.username} joined the chat`)

  socket.on('new user', function(id) {
    oldName = socket.username
    socket.username = id
    socket.broadcast.emit('server message', `${oldName} changed their name to ${socket.username}!`)
    socket.emit('server message', `welcome to the chat ${socket.username}!`)
  });

  socket.on('disconnect', function() { // bij een connectie die verbroken wordt, voer dit uit:
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg) {
    const stringArray = msg.split(" ");
    const textStyle = stringArray[0]
    if (textStyle.startsWith('/')) {
      io.emit('chat message', `${socket.username} : ${msg.substring(textStyle.length)}`, `${textStyle.substring(1)}`);
    } else {
      io.emit('chat message', `${socket.username} : ${msg}`);
    }
  });

  socket.on('server message', function(msg) {
    io.emit('server message', msg);
  });
});