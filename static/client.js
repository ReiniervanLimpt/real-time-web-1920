const gameWaiter = document.querySelector("#gameWaiter")
const chatForm = document.querySelector('.message')
const userForm = document.querySelector(".username")
const messages = document.querySelector("#messages")
const events = document.querySelector("#events")
const kills = document.querySelector("#championKills")
const teamChaos = document.querySelector("#teamChaos")
const teamOrder = document.querySelector("#teamOrder")
const nameSelector = document.querySelector("#nameSelector")

const commands = ["/items"]

import championUpdate from '/modules/championUpdate.js'
import eventUpdate from '/modules/eventUpdate.js'
import clearElements from '/modules/clearElements.js'
import teamAssigner from '/modules/teamAssigner.js'
import messageHandler from '/modules/messageHandler.js'

const socket = io(); // maakt een globale variabele van io dit is een connectie met de http server

userForm.addEventListener("submit", function(e) {
  e.preventDefault() // prevents page reloading
  socket.emit('new user', document.querySelector('#u').value);
  nameSelector.classList.add("hidden")
  return false
})

chatForm.addEventListener("submit", function(e) {
  e.preventDefault(); // prevents page reloading
  const message = document.querySelector("#m").value
  const stringArray = message.split(" ")
  const messageCommand = stringArray[0]
  const messageOption = stringArray[1]
  const assignedCommand = commands.includes(messageCommand)

  if (assignedCommand == true) {
    socket.emit('command message', messageOption, messageCommand.substring(1));
    m.value = ""
    return false
  } else if (assignedCommand == false && messageCommand.startsWith("/")) {
    socket.emit('error message', messageCommand, commands)
    socket.emit('chat message', message.substring(messageCommand.length));
    m.value = ""
    return false
  } else {
    socket.emit('chat message', message)
    m.value = ""
    return false
  }
})

socket.on('team assignment', function(championSplash, championName, championTeam) {
  teamAssigner.assignTeams(championSplash, championName, championTeam)
})

socket.on('new event', function(msg) {
  eventUpdate.updateEvent(msg)
})

socket.on('champion kill event', function(eventName, killer, victim) {
  eventUpdate.updateKillFeed(eventName, killer, victim)
})

socket.on('champion status', function(status, championName) {
  championUpdate.updateStatus(status, championName)
})

socket.on('update score', function(championName, championScore) {
  championUpdate.updateScore(championName, championScore)
})

socket.on('clear elements', function(clear) {
  clearElements.resetElements(clear)
})

socket.on('chat message', function(msg, sender) {
  messageHandler.chatMessage(msg, sender)
})

socket.on('server message', function(msg) {
  messageHandler.serverMessage(msg)
})

socket.on('error message', function(errmessage) {
  messageHandler.errorMessage(errmessage)
})

socket.on('game state', function(state) {
  if (state === "open") {
    gameWaiter.classList.add("hidden")
  } else {
    gameWaiter.classList.remove("hidden")
  }
})