var path = require('path');
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var KEYWORD = 'Cat';

app.use(express.static(path.join(__dirname, '../client/build/')));
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
    socket.on('drawPath', function(data) {
        socket.broadcast.emit('showPath', data);
    });

    socket.on('submit', function(keyword) {
        var correct = 0;
        if (KEYWORD == keyword) {
            correct = 1;
        }
        socket.emit('answer', {
            correct
        });
    });

    socket.on('message', function(message){
        if(message == 'getKeyWord'){
            socket.emit('keyword', KEYWORD);
            console.log(KEYWORD);
        }else if(message == 'clear'){
            io.sockets.emit('resetBoard');
        }
    });

    socket.on('disconnect', function() {});
});


server.listen(3000, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:3000');
});
