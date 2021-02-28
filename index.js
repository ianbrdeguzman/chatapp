const express = require('express');
const socket = require('socket.io');

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`);
})

// serve static files
app.use(express.static('public'));

// socket io setup
const io = socket(server);

// io event listener to connection
// console log if connection is made
io.on('connection', (socket) => {
    // console log new connection in the server
    console.log('New connection', socket.id)

    // welcome user when connected
    socket.emit('welcome', `Welcome to Chatapp👋!`);

    // emit chat data back to connected clients
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
    });

    // broadcast typing data back to connected clients
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    // broadcast when a new user joined
    socket.broadcast.emit('joined', `User has joined the chat`);

    // broadcast when a user disconnects
    socket.on('disconnect', () => {
        io.emit('left', `User has left the chat`)
    });
});