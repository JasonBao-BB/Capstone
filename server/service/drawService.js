module.exports = function(io) {

    var keywords = '';
    
    var guessWord = 'Cat';

    io.on('connection', function(socket) {
    //接收path
    socket.on('drawPath', function(data) {
        socket.broadcast.emit('showPath', data);
    });

    socket.on('submit', function(keyword) {
        var correct = 0;
        if (guessWord == keywords) {
            correct = 1;
        }
        socket.emit('answer', {
            correct
        });
    });

    socket.on('message', function(message){
        if(message == 'getKeyWord'){
            //guessWord = keywords[Math.floor(Math.random() * keywords.length)];
            socket.emit('keyword', guessWord);
        }else if(message == 'clear'){
            // socket.emit('showBoardClearArea');
            io.sockets.emit('resetBoard');
        }
    });

    socket.on('disconnect', function() {});
});
}