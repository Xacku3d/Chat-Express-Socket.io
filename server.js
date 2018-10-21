var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Server is running on port ${port}...`);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});