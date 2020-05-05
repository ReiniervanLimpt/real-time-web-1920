const commands = ["/yellow", "/blue", "/green", "/huge"]
const chatForm = document.querySelector('.message')
const userForm = document.querySelector(".username")
const messages = document.querySelector("#messages")
const events = document.querySelector("#events")
const nameSelector = document.querySelector("#nameSelector")

const socket = io(); // maakt een globale variabele van io dit is een connectie met de http server

userForm.addEventListener("submit", function(e) {
  console.log(document.querySelector('#u').value)
  e.preventDefault() // prevents page reloading
  socket.emit('new user', document.querySelector('#u').value);
  nameSelector.classList.add("hidden")
  return false
});



chatForm.addEventListener("submit", function(e) {
  e.preventDefault(); // prevents page reloading
  const message = document.querySelector("#m").value
  const stringArray = message.split(" ")
  const messageStyle = stringArray[0]
  const assignedStyle = commands.includes(messageStyle)
  console.log(message)

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
});

socket.on('new event', function(msg, time) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg + " time " + time
  events.appendChild(newMessage)
});

socket.on('styled message', function(msg, style) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  newMessage.classList.add(style)
  messages.appendChild(newMessage)
});

socket.on('chat message', function(msg) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  messages.appendChild(newMessage)
});

socket.on('server message', function(msg) {
  const newMessage = document.createElement("li")
  newMessage.textContent = msg
  messages.appendChild(newMessage)
});

socket.on('error message', function(errmessage) {
  const newMessage = document.createElement("li")
  newMessage.textContent = errmessage
  newMessage.classList.add("error")
  messages.appendChild(newMessage)
});