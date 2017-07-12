var path = require('path');
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var KEYWORD = '猫';

var users=[];

app.use(express.static(path.join(__dirname, '../client/build/')));
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {
    console.log("Connecting");


    //Drawing and Guessing
    socket.on('drawing', function(data) {
        socket.broadcast.emit('drawing', data);
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

    //Disconnect
    socket.on('disconnect', function() {
        users.splice(socket.usersIndex,1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });

    //Login
    socket.on('login', function(nickname){
        console.log('接收到用户信息');
        if(users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.usersIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
});


server.listen(3000, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:3000');
});
