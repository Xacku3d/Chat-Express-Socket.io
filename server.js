var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var connections = [];
var users = [];

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Server is running on port ${port}...`);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    //Disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected`);
    });

    //Send Message
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames(){
        io.sockets.emit('get users', users);
    }
});