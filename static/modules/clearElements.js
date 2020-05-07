const kills = document.querySelector("#championKills")

const clearElements = {

  resetElements: function(clear) {
    events.innerHTML = clear
    kills.innerHTML = clear
    teamChaos.innerHTML = clear
    teamOrder.innerHTML = clear
  }

}

export default clearElements;