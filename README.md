# League of legends client spectator

![example](https://user-images.githubusercontent.com/36195440/81354987-58290480-90cd-11ea-8894-799002acfdf1.png)

https://lol-client-spectator-rtw.herokuapp.com/

## DLC 

![data cycle 2_Tekengebied 1](https://user-images.githubusercontent.com/36195440/81355071-8c042a00-90cd-11ea-85e1-83ea77f3e172.png)

## How to install

### requirements

This app was made in nodeJS

### Copy this repo

1. fork this repo

2. copy the files to your computer `git clone https://github.com/ReiniervanLimpt/real-time-web-1920.git`

---

### install the webserver

1. change directory to the folder `cd directory/directory/directory 

2. install dependencies `npm install`

3. run the server on designated port (standard = 3000) `npm start`

---

## creating the client server :computer: :shipit:

*create a new server: navigate to an empty directory and `git init`

1. Create a server.js file and include `"start": "server.js",` in package.json's "scripts" tags

2. To send data to the webserver you will need to [create a self signed ssl certificate](https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node) and Riot Games [root certificate](https://developer.riotgames.com/docs/lol#game-client-api_live-client-data-api) (under Game Client API) 

4. Tell you pc to [trust the newly created SSL certificate](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/)

5. Install  `npm install body-parser` and `npm install request` and `npm install express`

6. Create a server which listens to https and pass the certificates to it

```javascript
const options = {
  cert: fs.readFileSync('*your cert file*'),
  key: fs.readFileSync('*your key file*),
  ca: fs.readFileSync('*riot games root certificate*')
}

const https = require('https').createServer(options, app)
https.listen(process.env.PORT || *Your desired port*)
```

7. GET data from your local league client

```javascript
let data = []

function retrieveData() {
  Request({
    method: 'GET',
    uri: 'https://127.0.0.1:2999/liveclientdata/allgamedata',
    agentOptions: {
      ca: options.ca
    }
  }, (err, res, body) => {
    const data = JSON.parse(body)
  })
}
```

8. POST data to your webserver (listens to port 3000 by default)

```javascript
function sendData(leagueData) {
  Request({
    method: 'POST',
    uri: 'http://localhost:3000/riotdata',
    json: leagueData
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    }
  })
}
```

9. in the webserver make sure you get the post request (using express) on the correct route

```javascript
app.post('/riotdata', function(req, res) {
  console.log(req.body)
  })
  ```

10. Start both servers and go to http://localhost:3000 :sparkles:

# :globe_with_meridians: API usage :globe_with_meridians:

This app makes use of the [riot games live client API](https://developer.riotgames.com/docs/lol#game-client-api_live-client-data-api) The game client API's are served over https and are only available to native applications... i cannot openly upload Riot Games root certificate so i had to work around that by creating another server which POSTs data to my live heroku website...

---

## Data sent by the live client API

The Live Client Data API has a number of endpoints that return a subset of the data returned by the /allgamedata endpoint. This endpoint is great for testing the Live Client Data API (from [riot games docs](https://developer.riotgames.com/docs/lol#game-client-api_live-client-data-api)

I decided to retrieve all the data and split this up into my desired global variables on the webserver

---

## dataset example

``` javascript
  "activePlayer": {
    "abilities": {
      "E": {},
    "championStats": {},
    "currentGold": 0.00000000000000,
    "fullRunes": {}
      "keystone": {},
      "primaryRuneTree": {},
      "secondaryRuneTree": {},
      "statRunes": [{}]
    },
    "level": 1,
    "summonerName": "..."
  },
  "allPlayers": [{}],
  "events": {
    "Events": [{
      "EventID": 0,
      "EventName": "GameStart",
      "EventTime": 0.00000000000000000
    }]
  },
  "gameData": {
    "gameMode": "CLASSIC",
    "gameTime": 0.000000000,
    "mapName": "Map11",
    "mapNumber": 11,
    "mapTerrain": "Default"
  }
}
```
---

## splitting up the data into usable smaller dataset

> The primary datasets my application needs are the event data, which is stored in `let eventLog` and is constatly updated when the client server sends a POST request.

```javascript
eventLog = [{
      "EventID": 0,
      "EventName": "GameStart",
      "EventTime": 0.00000000000000000
    },
    {
      "EventID": 1,
      "EventName": "nextEvent",
      "EventTime": 1.00000000000000000
    },
    ]
```

> Another dataset i needed was the data of all players

```javascript
allPlayers = [{
    "championName": "Annie",
    "isBot": false,
    "isDead": false,
    "items": [],
    "level": 1,
    "position": "",
    "rawChampionName": "game_character_displayname_Annie",
    "respawnTimer": 0.0,
    "runes": {},
    "scores": {},
    "skinID": 0,
    "summonerName": "Riot Tuxedo",
    "summonerSpells": {},
    "team": "ORDER"
  }],
```

> Which i also split up to create smaller subsets for team assignments and storen championnames so the user can retrieve their items by *championName* 

`let teamChaos = [array of allPlayers data for each player in team 'CHAOS']`

`let teamOrder = [array of allPlayers data for each player in team 'ORDER']`

`let allChampions = [array of all champion Names]`

`let score = {
  assists: 0,
  creepScore: 0,
  deaths: 0,
  kills: 0,
  wardScore: 0
}`

*score variable is a default state for the allPlayers.scores object*

---

# :satellite: Events :satellite:

* Users can chat with eachother

* Users get to request the items of a champion in game

* Teams get updated realtime

* Champions scores get updated realtime

* Events are shown realtime

* Champion scores are shown realtime

* error messages

## Events per socket connection

### game state events

```javascript
  //checks if the eventlog has been updated after data has been posted, if that is the case users can enter the "game"
  
    // checks if a new game has started based on last known gametime
  function newGameCheck() {
    if (newGameTime > gameTime) {
      socket.emit('clear elements', '')
      shownEvents = 0
      shownChampions = 0
    } else if (newGameTime === gameTime) {
      socket.emit('game state', "closed")
    }
  }
  
  function gameCheck() {
    if (eventLog.length > 0) {
      const gameStartCheck = eventLog[0].EventName
      if (gameStartCheck === "GameStart") {
        socket.emit('game state', "open")
      }
    }
  }

  setInterval(() => {
    gameCheck()
    newGameCheck()
    newGameTime = gameTime
  }, 1000)
})
```
```
EVENT = 'game state'
- Updates the webpage to no longer show the starting splash screen or show it when the game is no longer running

EVENT = 'clear elements'
- Updates all elements to show new data if a new game has started
```

![no game active](https://user-images.githubusercontent.com/36195440/81378305-5e3bd700-9107-11ea-8ef0-0dfa3879244b.png)

---

### Creating teams and displaying real time data

```javascript
 // if no champions have been rendered yet (checked with shownChampions, render them) this shows new champions if a new game has started
  function createTeams() {
    if (shownChampions === 0 && teamChaos.length != 0) {
      teamChaos.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      teamOrder.forEach(element => socket.emit('team assignment', `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${element.championName}.png`, `${element.championName}`, `${element.team}`))
      shownChampions++
    }
    setTimeout(createTeams, 1000)
  }
  createTeams()
```
```
EVENT = 'team assignment'
- Creates teams with the correct champion splash retrieved from the server, their Champions name and their team
```
---

```javascript
  // updating the score and state (dead / alive) of champions in game
  function checkState(champion) {
    const championScore = champion.scores
    if (champion.scores != score) {
      socket.emit('update score', `${champion.championName}`, `${championScore.kills} / ${championScore.deaths} / ${championScore.assists}`)
      score = championScore
    }
    if (champion.isDead === false) {
      socket.emit('champion status', "alive", `${champion.championName}`)
    } else {
      socket.emit('champion status', "dead", `${champion.championName}`)
    }
  }
  ```
```
EVENT = 'update score'
- Constantly checks the state of champions by their "scores" value

EVENT = 'champion status'
- Constantly checks if champion is still alive by their"isDead (bool)" value
```

![teams](https://user-images.githubusercontent.com/36195440/81380319-fe472f80-910a-11ea-972e-962948c5cc33.png)

---

### Updating events

```javascript
  // champion kill / regular events being split up
  function checkEventType(gameEvent) {
    if (gameEvent.EventName === "ChampionKill") {
      socket.emit('champion kill event', `${gameEvent.EventName}`, `${gameEvent.KillerName}`, `${gameEvent.VictimName}`)
    } else {
      socket.emit('new event', `${gameEvent.EventName}`)
    }
  }
```
```
EVENT = 'champion kill event'
- emits with 3 parameters: EventName, KillerName and VictimName to display in the kills section

EVENT = 'champion status'
- emits with 1 parameter: EventName to show in the regular event section
```
---
  
## User sent events

```
EVENT = 'new user'
- user gets assigned the name they fill in before they join the "game room

EVENT = 'command message'
- user gets to request the items of a champion in game being played by typing /items ChampionName
```

# :exclamation: Would haves :exclamation:

- [] i would have liked to implement more user intereaction, like a betting system allowing users to predict which team kills another champion first or first building destroyed
- [] more data for users to request (like the champion items)
- [] message log to show messages you missed when the server or the user is offline for a while
- [] game rooms for each dataset sent from a client server to the webserver

# :fireworks: Proud of's :fireworks:

I spent a lot of time splitting up the data received from the live client API and got to display their values as real-time as i hoped i would be able to when designing my concept, the data required me to constantly adapt and make changes to my ideas...

I have created an app which i can expand on and wish to be using myself as it is very handy to have running on a secondary monitor to get more data from, and become better in my League of Legends games!
