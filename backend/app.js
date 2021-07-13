const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
          userID: id,
          username: socket.username,
        });
      }
    socket.emit("users", users);
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
          return next(new Error("invalid username"));
        }
        socket.username = username;
        next();
    });
    
    // console.log(socket.id, 'a user connected');
    // console.log('connected users are: ', io.sockets.sockets);
    socket.on('disconnect', () => {
        console.log(socket.id, 'user disconnected');
    });

    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
      });

    // socket.on('setSocketId', (data) => {
    //     let userName = data.name;
    //     let userId = data.userId;
    //     userNames[userName] = userId;
    //     console.log("all users: ", JSON.stringify(userNames));
    // })
 });
server.listen(3000, () => {
    console.log("listening on port:3000");
});
// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         socket.broadcast.emit('chat message', msg);
//     });
// });
// http.listen(3000, () => {
//     console.log('listening on *:3000');
// });