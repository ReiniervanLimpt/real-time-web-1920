const request = require('request')
const fs = require('fs')

console.log("werkt")

const eventLog = []

function checkForEvents() {
  let oldEvents = 0
  request({
    method: 'GET',
    uri: 'https://127.0.0.1:2999/liveclientdata/allgamedata',
    agentOptions: {
      ca: options.ca
    }
  }, (err, res, body) => {
    const data = JSON.parse(body)
    const allEventsLength = data.events.Events.length
    const allEvents = data.events.Events

    if (oldEvents === 0) {
      const newEvents = allEventsLength - oldEvents
      allEvents.forEach(element => eventLog.push(element))
      oldEvents = allEventsLength
      console.log(oldEvents)
      console.log(eventLog)
    } else {
      const latestEvent = allEventsLength - 1
      eventLog.push[latestEvent]
    }
  })
  console.log(eventLog)
  setTimeout(checkForEvents, 1000)
}

checkForEvents()