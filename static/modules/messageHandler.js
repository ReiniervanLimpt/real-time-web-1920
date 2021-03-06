const messageHandler = {

  chatMessage: function(msg, sender) {
    const newMessage = document.createElement("li")
    newMessage.classList.add(sender)
    newMessage.textContent = msg
    messages.appendChild(newMessage)
  },

  serverMessage: function(msg) {
    const newMessage = document.createElement("li")
    newMessage.textContent = msg
    messages.appendChild(newMessage)
  },

  errorMessage: function(errmessage) {
    const newMessage = document.createElement("li")
    newMessage.textContent = errmessage
    newMessage.classList.add("error")
    messages.appendChild(newMessage)
  }

}

export default messageHandler;