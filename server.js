const express = require('express')
const app = express()
const fs = require('fs')
const Request = require('request')
const bodyParser = require('body-parser')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

// global variables to store received data

let allPlayers = []
let gameTime = 0
let allChampions = []
let eventLog = []
let teamChaos = []
let teamOrder = []
let score = {
  assists: 0,
  creepScore: 0,
  deaths: 0,
  kills: 0,
  wardScore: 0
}

function open(req, res) {
  res.render('index.ejs')
}

http.listen(process.env.PORT || 3000)

app.get('/', open)
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


// with help from Maikel Sleebos, data is sent from local using a POST request
app.post('/riotdata', function(req, res) {

  eventLog = req.body.events.Events

  allPlayers = req.body.allPlayers

  gameTime = req.body.gameData.gameTime

  getTeams()

})

// Splitting up players into their corresponding teams and storing active championnames
function getTeams() {
  teamChaos = allPlayers.filter(function(team) {
    return team.team === "CHAOS"
  })

  teamOrder = allPlayers.filter(function(team) {
    return team.team === "ORDER"
  })

  allChampions = allPlayers.map(function(champion) {
    return champion.championName
  })

}

// the following code is unique to every socket that connects
io.on('connection', function(socket) {

  // variables used to check if the socket received the data from the server
  let newGameTime = 0
  let shownEvents = 0
  let shownChampions = 0
  let itemNames = []

  socket.emit('clear elements', '')

  // checks if a new game has started based on last known gametime
  function newGameCheck() {
    if (newGameTime > gameTime) {
      socket.emit('clear elements', '')
      shownEvents = 0
      shownChampions = 0
    } else if (newGameTime === gameTime) {
      socket.emit('game state', "closed")
    }
  }

  // if no champions have been rendered yet (checked with shownChampions, render them) this shows new champions if a new game has started
  function createTeams() {
    if (shownChampions === 0 && teamChaos.length != 0) {
      teamChaos.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      teamOrder.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      shownChampions++
    }
    setTimeout(createTeams, 1000)
  }

  createTeams()

  // checks if there are new events to show the user
  function updateEvents() {
    if (shownEvents === 0) {
      eventLog.forEach(element => checkEventType(element))
      shownEvents = eventLog.length
    } else if (shownEvents + 2 === eventLog.length) { // some events fire at the exact same time requiring me to adress them this way
      const latestEvent = eventLog.length - 1
      const duplicateEvent = eventLog.length - 2
      checkEventType(eventLog[eventLog.length - 1])
      checkEventType(eventLog[eventLog.length - 2])
      shownEvents = eventLog.length
    } else if (shownEvents + 1 === eventLog.length) {
      const latestEvent = eventLog.length - 1
      checkEventType(eventLog[eventLog.length - 1])
      shownEvents = eventLog.length
    }
    allPlayers.forEach(element => checkState(element))
    setTimeout(updateEvents, 1000)
  }

  updateEvents()

  // champion kill / regular events being split up
  function checkEventType(gameEvent) {
    if (gameEvent.EventName === "ChampionKill") {
      socket.emit('champion kill event', `${gameEvent.EventName}`, `${gameEvent.KillerName}`, `${gameEvent.VictimName}`)
    } else {
      socket.emit('new event', `${gameEvent.EventName}`)
    }
  }

  // updating the score and state (dead / alive) of champions in game
  function checkState(champion) {
    const championScore = champion.scores
    if (champion.scores != score) {
      socket.emit('update score', `${champion.championName}`, `${championScore.kills} / ${championScore.deaths} / ${championScore.assists}`)
      score = championScore
    }
    if (champion.isDead === false) {
      socket.emit('champion status', "alive", `${champion.championName}`)
    } else {
      socket.emit('champion status', "dead", `${champion.championName}`)
    }
  }

  socket.username = `anonymous`

  socket.broadcast.emit(`${socket.username} joined the chat`)
  // user gets assigned their username they selected, this gets stored in the socket
  socket.on('new user', function(id) {
    oldName = socket.username
    socket.username = id
    socket.broadcast.emit('server message', `${oldName} changed their name to ${socket.username}!`)
    socket.emit('server message', `welcome to the chat ${socket.username}!`)
  })

  socket.on('disconnect', function() { // bij een connectie die verbroken wordt, voer dit uit:
    socket.broadcast.emit('chat message', `${socket.username} disconnected from chat`, "other")
    console.log('user disconnected');
  })

  socket.on('error message', function(error, options) {
    socket.emit('error message', `${error} is not a command try : ${options} *Championname*`)
  })

  // user can write /items *Champion name* this retrieves the names of the items the champion is currently holding
  socket.on('command message', function(champion, command) {
    const championCheck = allChampions.includes(champion)

    if (championCheck === true) {
      const retrievedChampion = allPlayers.filter(function(name) {
        return name.championName === `${champion}`
      })
      const retrievedItems = retrievedChampion[0].items
      retrievedItems.forEach(element => showItems(element))
      socket.emit('chat message', `${champion}'s items: '${itemNames}`)
      itemNames = []
    } else {
      socket.emit('error message', `${champion} is not in this game...`)
    }
  })

  function showItems(items) {
    itemNames.push(" " + items.displayName)
  }

  socket.on('chat message', function(msg) {
    socket.broadcast.emit('chat message', `${socket.username} : ${msg}`, "other")
    socket.emit('chat message', `${msg}`)
  })

  socket.on('server message', function(msg) {
    io.emit('server message', msg)
  })

  //checks if the eventlog has been updated after data has been posted, if that is the case users can enter the "game"
  function gameCheck() {
    if (eventLog.length > 0) {
      const gameStartCheck = eventLog[0].EventName
      if (gameStartCheck === "GameStart") {
        socket.emit('game state', "open")
      }
    }
  }

  setInterval(() => {
    gameCheck()
    newGameCheck()
    newGameTime = gameTime
  }, 1000)
})