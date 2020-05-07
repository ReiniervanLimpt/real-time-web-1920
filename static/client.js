import championUpdate from '/modules/championUpdate.js'
import eventUpdate from '/modules/eventUpdate.js'
import clearElements from '/modules/clearElements.js'
import teamAssigner from '/modules/teamAssigners.js'
import formHandler from '/modules/formHandler.js'
const commands = ["/yellow", "/blue", "/green", "/huge"]
const chatForm = document.querySelector('.message')
const userForm = document.querySelector(".username")
const messages = document.querySelector("#messages")
const events = document.querySelector("#events")
const kills = document.querySelector("#championKills")
const teamChaos = document.querySelector("#teamChaos")
const teamOrder = document.querySelector("#teamOrder")
const nameSelector = document.querySelector("#nameSelector")

const socket = io(); // maakt een globale variabele van io dit is een connectie met de http server

userForm.addEventListener("submit", formHandler.newUser(e))

chatForm.addEventListener("submit", formHandler.newChatMessage(e))

socket.on('team assignment', teamAssigner.assignTeams(championSplash, championName, championTeam))

socket.on('new event', eventUpdate.updateEvent(msg))

socket.on('champion kill event', eventUpdate.updateKillFeed(eventName, killer, victim))

socket.on('champion status', championUpdate.updateStatus(status, championName))

socket.on('update score', championUpdate.updateScore(championName, championScore))

socket.on('clear elements', clearElements.resetElements(clear))

socket.on('styled message', function(msg, style) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  newMessage.classList.add(style)
  messages.appendChild(newMessage)
})

socket.on('chat message', function(msg, sender) {
  const newMessage = document.createElement("li")
  newMessage.classList.add(sender)
  newMessage.textContent = msg
  messages.appendChild(newMessage)
})

socket.on('server message', function(msg) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  messages.appendChild(newMessage)
})

socket.on('error message', function(errmessage) {
  const newMessage = document.createElement("li")
  newMessage.textContent = errmessage
  newMessage.classList.add("error")
  messages.appendChild(newMessage)
})