# League of legends client spectator

![example](https://user-images.githubusercontent.com/36195440/81354987-58290480-90cd-11ea-8894-799002acfdf1.png)

https://lol-client-spectator-rtw.herokuapp.com/

![data cycle 2_Tekengebied 1](https://user-images.githubusercontent.com/36195440/81355071-8c042a00-90cd-11ea-85e1-83ea77f3e172.png)

## How to install

### requirements

This app was made in nodeJS

### Copy this repo

1. fork this repo

2. copy the files to your computer `git clone https://github.com/ReiniervanLimpt/real-time-web-1920.git`

### install the webserver

1. change directory to the folder `cd directory/directory/directory 

2. install dependencies `npm install`

3. run the server on designated port (standard = 3000) `npm start`

### creating the client server :computer: :clipboard:

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

9. Start both servers and go to http://localhost:3000 :sparkles:
