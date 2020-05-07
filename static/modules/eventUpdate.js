const eventUpdate = {

  updateEvent: function(msg) {
    const newMessage = document.createElement("li")
    newMessage.textContent = msg
    events.appendChild(newMessage)
  },

  updateKillFeed: function(eventName, killer, victim) {
    const newKillCard = document.createElement("article")
    const newKillMessage = document.createElement("p")
    const killOrder = document.createElement("p")
    newKillMessage.textContent = eventName
    killOrder.textContent = killer + " > " + victim
    kills.appendChild(newKillCard)
    newKillCard.appendChild(newKillMessage)
    newKillCard.appendChild(killOrder)
  }

}

export default eventUpdate;