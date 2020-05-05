const express = require('express')
const app = express()
const fs = require('fs')
const request = require('request')

const eventLog = []
const userBets = []
const userPoints = 0

const options = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  ca: fs.readFileSync('riotgames.pem')
}

// with help from Maikel Sleebos

const https = require('https').createServer(options, app)
const io = require('socket.io')(https)

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static('static'))

https.listen(process.env.PORT || 3000)

app.get('/', open)

function open(req, res) {
  res.render('index.ejs')
}

io.on('connection', function(socket) { // de code die uitegvoerd wordt voor elke connectie/socket:

  function checkForEvents() {
    console.log("check")
    request({
      method: 'GET',
      uri: 'https://127.0.0.1:2999/liveclientdata/allgamedata',
      agentOptions: {
        ca: options.ca
      }
    }, (err, res, body) => {
      const data = JSON.parse(body)
      const allEventsLength = data.events.Events.length
      const allEvents = data.events.Events

      if (eventLog.length < allEventsLength && eventLog.length === 0) {

        eventLog.forEach(element => socket.emit('new event', `${element.EventName}`, `${element.EventTime}`))
        allEvents.forEach(element => eventLog.push(element))
      } else if (eventLog.length < allEventsLength) {
        const latestEvent = allEventsLength - 1
        socket.emit('new event', `${allEvents[latestEvent].EventName}`)
        eventLog.push(allEvents[latestEvent])
      }
    })
    console.log(eventLog)
    setTimeout(checkForEvents, 1000)
  }

  checkForEvents()

  socket.username = `anonymous`

  socket.broadcast.emit(`${socket.username} joined the chat`)

  socket.on('new user', function(id) {
    oldName = socket.username
    socket.username = id
    socket.broadcast.emit('server message', `${oldName} changed their name to ${socket.username}!`)
    socket.emit('server message', `welcome to the chat ${socket.username}!`)
  })

  socket.on('disconnect', function() { // bij een connectie die verbroken wordt, voer dit uit:
    console.log('user disconnected');
  })

  socket.on('error message', function(error, options) {
    socket.emit('error message', `${error} is not a command try : ${options}`)
  })

  socket.on('styled message', function(msg, style) {
    socket.broadcast.emit('styled message', `${socket.username} : ${msg}`, style)
    socket.emit('styled message', `${msg}`, style)
  })

  socket.on('chat message', function(msg) {
    socket.broadcast.emit('chat message', `${socket.username} : ${msg}`)
    socket.emit('chat message', `${msg}`)
  })

  socket.on('server message', function(msg) {
    io.emit('server message', msg)
  })
})