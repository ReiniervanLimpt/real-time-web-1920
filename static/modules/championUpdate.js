const championUpdate = {

  updateStatus: function(status, championName) {
    const champion = document.getElementsByClassName(`${championName}`)[0]
    if (status === "dead") {
      champion.classList.add("dead")
    } else {
      champion.classList.remove("dead")
    }
  },

  updateScore: function(championName, championScore) {
    const score = document.getElementsByClassName(`${championName}Score`)[0]
    score.textContent = `${championScore}`
  })

}

export default championUpdate;