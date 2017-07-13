var path = require('path');
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);


var keyword = ['猫', '大象', '飞机', '钱', '炸弹', '猪'];
var KEYWORD;

//计数玩游戏有多少人
var onlineUsers = {};
var onlineCount = 0;

app.use(express.static(path.join(__dirname, '../client/build/')));
app.use('/static', express.static(path.join(__dirname, '../client/build/static/')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket) {

    //Drawing and Guessing
    socket.on('drawing', function(data) {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('submit', function(keyword) {
        var correct = 0;
        console.log("正确答案: "+ KEYWORD);
        if (KEYWORD == keyword) {
            correct = 1;
        }
        socket.emit('answer', {
            correct
        });
    });

    socket.on('message', function(message){

        if(message == 'getKeyWord'){
            KEYWORD = keyword[Math.floor(Math.random() * keyword.length)];
            socket.emit('keyword', KEYWORD);
            console.log(KEYWORD);
        }else if(message == 'clear'){
            io.sockets.emit('resetBoard');
        }
    });

    //Login
    socket.on('login', function(obj){
        console.log(obj);
        // 用户id设为socketid
        socket.id = obj.uniqueID;
        console.log("用户的id是"+ obj.uniqueID);
        // 如果没有这个用户，那么在线人数+1，将其添加进在线用户

        if (!onlineUsers.hasOwnProperty(obj.uniqueID)) {
            onlineUsers[obj.uniqueID] = obj.username;
            onlineCount++;
            console.log("新添加一个用户"+onlineUsers[obj.uniqueID] + ' 当前人数'+onlineCount);
        }
        // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
        
        io.sockets.emit('login', {
            onlineUsers : onlineUsers, 
            onlineCount : onlineCount, 
            user : obj
        });
        console.log(onlineCount + onlineUsers);
        console.log(obj.username+'加入了群聊');
    });


    //Chat message
    socket.on('chatmessage', function(obj){
        io.emit('chatmessage', obj);
        console.log(obj.username+"说:"+ obj.message);
    });

     //Disconnect
    socket.on('disconnect', function() {
        if (onlineUsers.hasOwnProperty(socket.id)) {
            var user = {
                uniqueID : socket.id,
                username : onlineUsers[socket.id]
            };

            delete onlineUsers[socket.id];
            onlineCount--;

            io.emit('logout', {
                onlineUsers : onlineUsers,
                onlineCount : onlineCount,
                user : user
            });

            console.log(user.username + " quit the game");
        }
    });
});


server.listen(3000, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:3000');
});
