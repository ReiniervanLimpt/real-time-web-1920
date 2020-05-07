const teamAssigner = {

  assignTeams: function(championSplash, championName, championTeam) {
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
  }

}

export default teamAssigner;