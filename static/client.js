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
  const messageStyle = stringArray[0]
  const assignedStyle = commands.includes(messageStyle)

  if (assignedStyle == true) {
    socket.emit('styled message', message.substring(messageStyle.length), messageStyle.substring(1));
    m.value = ""
    return false
  } else if (assignedStyle == false && messageStyle.startsWith("/")) {
    socket.emit('error message', messageStyle, commands)
    socket.emit('chat message', message.substring(messageStyle.length));
    m.value = ""
    return false
  } else {
    socket.emit('chat message', message)
    m.value = ""
    return false
  }
})

socket.on('team assignment', function(championSplash, championName, championTeam) {
  const newChampionCard = document.createElement("article")
  const newChampion = document.createElement("img")
  const newChampionName = document.createElement("p")
  const newChampionScore = document.createElement("p")
  newChampion.classList.add(championName)
  newChampionCard.classList.add(`${championName}Card`)
  newChampionName.textContent = championName
  newChampionScore.textContent = "0 / 0 / 0"
  newChampionScore.classList.add(`${championName}Score`, "championScore")
  newChampion.src = championSplash
  if (championTeam === "CHAOS") {
    teamChaos.appendChild(newChampionCard)
    newChampionCard.appendChild(newChampion)
    newChampionCard.appendChild(newChampionName)
    newChampionCard.appendChild(newChampionScore)
  } else if (championTeam === "ORDER") {
    teamOrder.appendChild(newChampionCard)
    newChampionCard.appendChild(newChampion)
    newChampionCard.appendChild(newChampionName)
    newChampionCard.appendChild(newChampionScore)
  }
})

socket.on('new event', function(msg) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  events.appendChild(newMessage)
})

socket.on('champion kill event', function(eventName, killer, victim) {
  const newKillCard = document.createElement("article")
  const newKillMessage = document.createElement("p")
  const killOrder = document.createElement("p")
  newKillMessage.textContent = eventName
  killOrder.textContent = killer + " > " + victim
  kills.appendChild(newKillCard)
  newKillCard.appendChild(newKillMessage)
  newKillCard.appendChild(killOrder)
})

socket.on('champion status', function(status, championName) {
  const champion = document.getElementsByClassName(`${championName}`)[0]
  if (status === "dead") {
    champion.classList.add("dead")
  } else {
    champion.classList.remove("dead")
  }
})

socket.on('update score', function(championName, championScore) {
  const score = document.getElementsByClassName(`${championName}Score`)[0]
  score.textContent = `${championScore}`
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