const commands = ["/yellow", "/blue", "/green", "/huge"]

$(function() {

  const socket = io(); // maakt een globale variabele van io dit is een connectie met de http server
  $('form.message').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    const message = $('#m').val()
    const stringArray = message.split(" ");
    const messageStyle = stringArray[0]
    const assignedStyle = commands.includes(messageStyle)
    console.log(assignedStyle)

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
  });

  $('form.username').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('new user', $('#u').val());
    return false;
  });

  socket.on('styled message', function(msg, style, sender) {
    $('#messages').append($('<li id="' + sender + '" class="' + style + `">`).text(msg));
  });

  socket.on('chat message', function(msg, sender) {
    $('#messages').append($('<li id="' + sender + `">`).text(msg));
  });

  socket.on('server message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('error message', function(errmessage) {
    $('#messages').append($('<li class="error">').text(errmessage));
  });

});