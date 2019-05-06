const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const connections = [];
const users = [];

//Link static files
app.use(express.static(__dirname + '/public'));

//Start server
const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Server is running on port ${port}...`);

//Send index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

//Connect
io.sockets.on('connection', (socket) => {
    //Add connection
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    //Disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected`);
    });

    //Send Message
    socket.on('send message', (data) => {
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    //Update Users
    function updateUserNames(){
        io.sockets.emit('get users', users);
    }
});