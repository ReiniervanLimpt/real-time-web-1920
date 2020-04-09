const commands = ["/red", "/blue", "/green", "/huge"]

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
    } else {
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    }
  });

  $('form.username').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('new user', $('#u').val());
    return false;
  });

  socket.on('styled message', function(msg, style) {
    $('#messages').append($('<li class="' + style + `">`).text(msg));
  });

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('server message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

});