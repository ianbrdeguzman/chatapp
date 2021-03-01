const express = require('express');
const socket = require('socket.io');
const moment = require('moment');

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`);
})

const users = [];

// serve static files
app.use(express.static('public'));

// socket io setup
const io = socket(server);

// io event listener to connection
// console log if connection is made
io.on('connection', (socket) => {
    // console log new connection in the server
    console.log(`New connection ${socket.id}`, users)

    socket.on('join', ({username, room}) => {
        users.push({
            username,
            room,
            id: socket.id,
        });

        // welcome user when connected
        socket.emit('welcome', {
            username,
            message: 'welcome to Chatapp👋!',
            room,
            users: users,
        });

        // join specific room
        socket.join(room)

        // broadcast when a new user joined
        socket.broadcast.to(room).emit('joined', {
            username,
            message: 'has joined the room',
            room: room,
            users: users
        });

        // broadcast when a user disconnects
        socket.on('disconnect', () => {
            const index = users.findIndex(user => user.id === socket.id)
            users.splice(index, 1);

            io.to(room).emit('left', {
                username,
                message: 'has left the room',
                room: room,
                users: users,
            })
        });

        // emit chat data back to connected clients
        socket.on('chat', (data) => {
            io.sockets.to(room).emit('chat', {
                username: data.username,
                message: data.message,
                time: moment().format('LT'),
            });
        });

        // broadcast typing data back to connected clients
        socket.on('typing', (data) => {
            socket.broadcast.to(room).emit('typing', data);
        });
    })
});