const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

const options = {
  cert: fs.readFileSync('{CREATED SELF SIGNED CERTIFICATE}'),
  key: fs.readFileSync('{CREATED KEY}'),
  ca: fs.readFileSync('{RIOT ROOT CERTIFICATE}')
}

const https = require('https').createServer(options, app)

const Request = require('request')


app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


https.listen(process.env.PORT || 4000)

let data = []

function sendData(leagueData) {
  Request({
    method: 'POST',
    uri: '{YOURWEBADRESS} /riotdata',
    json: leagueData
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body)
    }
  })
}

function retrieveData() {
  Request({
    method: 'GET',
    uri: 'https://127.0.0.1:2999/liveclientdata/allgamedata',
    agentOptions: {
      ca: options.ca
    }
  }, (err, res, body) => {
    const data = JSON.parse(body)
    sendData(data)
  })
}

setInterval(() => {
  retrieveData()
}, 1000)