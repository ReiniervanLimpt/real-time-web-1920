# Real-Time Web @cmda-minor-web · 2019-2020

[rubric]: https://docs.google.com/spreadsheets/d/e/2PACX-1vSd1I4ma8R5mtVMyrbp6PA2qEInWiOialK9Fr2orD3afUBqOyvTg_JaQZ6-P4YGURI-eA7PoHT8TRge/pubhtml

## Week 1 progress:

### notes on getting started with socket.io

> with the help of the tutorial i created a chat application for people who can connect to my server.

```javascript
io.on('connection', function(socket) { // bij een nieuwe connectie, voer dit uit:
  console.log('a user connected');
  socket.on('disconnect', function() { // bij een connectie die verbroken wordt, voer dit uit:
    console.log('user disconnected');
    console.log(socket.server.sockets.sockets) // door het socket object heen gespit op zoek naar nog actieve sockets
  });
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});
```

- [x] set up an express server
- [x] finish the Socket.IO [getting started](https://socket.io/get-started/chat/) chat application with websockets.
- [ ] deploy to heroku
- [ ] land on an idea for my application, what am i going to do?
