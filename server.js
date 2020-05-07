const express = require('express')
const app = express()
const fs = require('fs')
const Request = require('request')
const bodyParser = require('body-parser')

const http = require('http').createServer(app)
const io = require('socket.io')(http)


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

let gameCheck = 0
let allPlayers = []
let allChampions = []
let allEvents = []
let leagueData = []
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

app.post('/riotdata', function(req, res) {

  allEvents = req.body.events.Events
  allPlayers = req.body.allPlayers

  checkForEvents(allEvents)
  getTeams(allPlayers)

})

// setInterval(() => {
//   gamecheck + 2
// }, 5000)

function checkForEvents(allEvents) {
  const allEventsLength = allEvents.length

  if (eventLog.length === 0) {
    allEvents.forEach(element => eventLog.push(element))
  } else if (eventLog.length + 2 === allEventsLength) {
    const latestEvent = allEventsLength - 1
    const duplicateEvent = allEventsLength - 2
    eventLog.push(allEvents[duplicateEvent])
    eventLog.push(allEvents[latestEvent])
  } else if (eventLog.length + 1 === allEventsLength) {
    const latestEvent = allEventsLength - 1
    eventLog.push(allEvents[latestEvent])
  }
}

function getTeams(allPlayers) {
  if (teamOrder.length === 0) {
    allPlayers.forEach(element => storeChampions(element))
    allPlayers.forEach(element => assignTeam(element))
  }

  function assignTeam(player) {
    if (player.team === "CHAOS") {
      teamChaos.push(player)
    } else if (player.team === "ORDER") {
      teamOrder.push(player)
    }
  }
}

function storeChampions(champion) {
  allChampions.push(champion.championName)
}



io.on('connection', function(socket) {

  let itemNames = []

  socket.emit('clear elements', '')

  let shownEvents = 0
  let shownChampions = 0

  function createTeams() {
    if (shownChampions === 0 && teamChaos.length != 0) {
      teamChaos.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      teamOrder.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      shownChampions++
    }
    setTimeout(createTeams, 1000)
  }

  createTeams()

  function updateEvents() {
    if (shownEvents === 0) {
      eventLog.forEach(element => checkEventType(element))
      shownEvents = eventLog.length
    } else if (shownEvents + 2 === eventLog.length) {
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


  function checkEventType(gameEvent) {
    if (gameEvent.EventName === "ChampionKill") {
      socket.emit('champion kill event', `${gameEvent.EventName}`, `${gameEvent.KillerName}`, `${gameEvent.VictimName}`)
    } else {
      socket.emit('new event', `${gameEvent.EventName}`)
    }
  }

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

  function gameCheck() {
    if (eventLog.length > 0) {
      const gameStartCheck = eventLog[0].EventName
      const gameEndCheck = eventLog[eventLog.length - 1].EventName
      if (gameStartCheck === "GameStart" && gameEndCheck != "GameEnd") {
        socket.emit('game state', "open")
      } else if (gameEndCheck === "GameEnd") {
        socket.emit('game state', "closed")
      }
    }
  }

  setInterval(() => {
    gameCheck()
  }, 1000)
})