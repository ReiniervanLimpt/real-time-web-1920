const chatForm = document.querySelector('.message')
const userForm = document.querySelector(".username")
const messages = document.querySelector("#messages")
const events = document.querySelector("#events")
const kills = document.querySelector("#championKills")
const teamChaos = document.querySelector("#teamChaos")
const teamOrder = document.querySelector("#teamOrder")
const nameSelector = document.querySelector("#nameSelector")

import championUpdate from '/modules/championUpdate.js'
import eventUpdate from '/modules/eventUpdate.js'
import clearElements from '/modules/clearElements.js'
import teamAssigner from '/modules/teamAssigner.js'
import formHandler from '/modules/formHandler.js'

const socket = io(); // maakt een globale variabele van io dit is een connectie met de http server

userForm.addEventListener("submit", function(e) {
  formHandler.newUser(e)
})

chatForm.addEventListener("submit", function(e) {
  formHandler.newChatMessage(e)
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