const commands = ["/items"]
const socket = io();

const formHandler = {

  newUser: function(e) {
    e.preventDefault() // prevents page reloading
    socket.emit('new user', document.querySelector('#u').value);
    nameSelector.classList.add("hidden")
    return false
  },

  newChatMessage: function(e) {
    e.preventDefault(); // prevents page reloading
    const message = document.querySelector("#m").value
    const stringArray = message.split(" ")
    const messageStyle = stringArray[0]
    const assignedStyle = commands.includes(messageStyle)

    if (assignedStyle == true) {
      socket.emit('command message', message.substring(messageStyle.length), messageStyle.substring(1));
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
  }

}

export default formHandler;