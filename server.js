var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require('fs');

server.listen(7000, function() {
    console.log('7000 port');
});

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', function(client) {
    client.on('join', function() {
        fs.readFile('logs.json', "utf8", function (err, json) {
            if(err) {
                return console.log(err);
            }
            client.emit('messages', JSON.parse(json));
        });
    });

    client.on('messages', function(data) {
        client.broadcast.emit('messages', data);
        fs.writeFile("logs.json", JSON.stringify(data, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });

});

