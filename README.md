# Real-Time Web @cmda-minor-web · 2019-2020

[rubric]: https://docs.google.com/spreadsheets/d/e/2PACX-1vSd1I4ma8R5mtVMyrbp6PA2qEInWiOialK9Fr2orD3afUBqOyvTg_JaQZ6-P4YGURI-eA7PoHT8TRge/pubhtml

## Week 1 progress: https://real-time-chat-app-rvl.herokuapp.com/

### notes on getting started with socket.io

> with the help of the tutorial i created a chat application for people who can connect to my server.

```javascript
io.on('connection', function(socket) { // voor elke connectie, voer dit uit:
  console.log('a user connected');
  socket.on('disconnect', function() { // als de connectie verbroken wordt, voer dit uit
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});
```

- [x] set up an express server
- [x] finish the Socket.IO [getting started](https://socket.io/get-started/chat/) chat application with websockets.
- [x] deploy to heroku
- [ ] land on an idea for my application, what am i going to do?

### broadcast.emit and regular emit

I played around with the example Guido gave us, first by implementing the option to change your username by creating another form which emits a 'new user event':

```javascript
  $('form.username').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('new user', $('#u').val());
    return false;
  });
```

On the server i handle the event which sends a different message to the sender and receivers of the message by using `socket.broadcast.emit` to send to others and `socket.emit` to send to your socket.

*the event:

```javascript
  socket.on('new user', function(id) {
    oldName = socket.username
    socket.username = id
    socket.broadcast.emit('server message', `${oldName} changed their name to ${socket.username}!`)
    socket.emit('server message', `welcome to the chat ${socket.username}!`)
  });
```

### adding stylized messages

I hardcoded in an array of stylized message options `const commands = ["/yellow", "/blue", "/green", "/huge"]`
users can now write /huge {their message} to enlarge the text of their message by sending out a 'styled message' event instead of a regular 'chat message' which is handled in an if statement checking if the first word starts with a / and if its a known command:

```javascript
    if (assignedStyle == true) {
      socket.emit('styled message', message.substring(messageStyle.length), messageStyle.substring(1));
      $('#m').val('');
      return false;
    } else if (assignedStyle == false && messageStyle.startsWith("/")) {
      socket.emit('error message', messageStyle, commands)
      socket.emit('chat message', message.substring(messageStyle.length));
      $('#m').val('');
      return false;
    } else {
      socket.emit('chat message', message);
      $('#m').val('');
      return false;
    }
 ```
 
In the serverside JS i give the user feedback when their command is not a known command by emitting an 'error message' event to his/her socket only:

```javascript
  socket.on('error message', function(error, options) {
    socket.emit('error message', `${error} is not a command try : ${options}`)
  });
```

And when the command is met:

```javascript
  socket.on('styled message', function(msg, style, sender) {
    socket.broadcast.emit('styled message', `${socket.username} : ${msg}`, style, "other");
    socket.emit('styled message', `you : ${msg}`, style, "myMessage")
  });
```

## Week 2 progress:

## Data lifecycle

![data cycle_Tekengebied 1_Tekengebied 1](https://user-images.githubusercontent.com/36195440/79560914-c0755f00-80a8-11ea-9419-e8430049459e.png)

During week 2 i will be building a webapp which consumes data from an external source.

### RIOT GAMES api

Riot games allows users with a RIOT account to generate a api key for development purposes, from reading it [docs](https://developer.riotgames.com/docs/lol) i found that it also includes live game data, which got me thinking about an app which you can run on a secondary monitor which would serve as a "live hack" helping you track in game data in a more clear way.

This would mean my application would only work locally... 

### Rate limits and usage

![data cycle_Tekengebied 1_Tekengebied 1_Tekengebied 1](https://user-images.githubusercontent.com/36195440/79844506-0a698800-83bc-11ea-8bc6-3d7feb3bda21.png)


For development puproses Riot games hands out api keys which have a one day expiration period, these can be requested every day however.

The api also includes endpoints which require no keys, 
