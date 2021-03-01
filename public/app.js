// make connection
const socket = io.connect('http://localhost:3000/') // change this

// HTML DOM elements
const output = document.querySelector('.output');
const message = document.querySelector('#message');
const form = document.querySelector('#chat-form');
const feedback = document.querySelector('.feedback');
const roomName = document.querySelector('.room-name');
const userContainer = document.querySelector('.users');

// get username and room from URL
const url = window.location.search;
const queries = new URLSearchParams(url);
const username = queries.get('username');
const room = queries.get('room');

// chat form submit eventlistener
form.addEventListener('submit', (e) => {
    // prevent the page from reloading
    e.preventDefault();
    // emit message value to the server
    if (message.value) {
        socket.emit('chat', {
            username,
            message: message.value,
        })
    }
    // reset the message value
    message.value = '';
});

// message input text box event listener
message.addEventListener('keydown', () => {
    // emit message to the server when keydown
    socket.emit('typing', `${username} is typing...`)
})

// emit username and room when user join 
socket.emit('join', { username, room });

// catch 'chat' from server
socket.on('chat', (data) => {
    // create a new html
    const html = 
    `
    <div class="message">
        <div class="message-main">
            <p>${data.message}</p>
        </div>
        <div class="message-header">
            <p>${data.username} ${data.time}</p>
        </div>
    </div>
    `;
    // insert html to output container
    output.insertAdjacentHTML('beforeend', html);
    // reset feedback 
    feedback.innerHTML = '';
    // auto scroll down
    output.scrollTop = output.scrollHeight;
});

// catch 'typing' from server
socket.on('typing', (data) => {
    // create new html
    const html = `<em>${data}</em`
    // change feedback inner html
    feedback.innerHTML = html;
});

// catch 'welcome' from server
socket.on('welcome', (data) => {
    // set timeout to welcome user
    setTimeout( () => {
        // create new html
        const roomname =
        `
        <div class="message">
            <div class="message-main">
                <p>Hello ${data.username} ${data.message}</p>
            </div>
        </div>
        `
        // insert new html into output container
        output.insertAdjacentHTML('beforeend', roomname);
    }, 500)
    // change room name 
    roomName.innerHTML = data.room;
    // get username from data
    currentUsers(data);
    // reset feedback inner html
    feedback.innerHTML = '';
});

// catch 'joined' from server
socket.on('joined', (data) => {
    currentUsers(data);
    notification(data);
});

// catch 'left' from server
socket.on('left', (data) => {
    currentUsers(data);
    notification(data);
});

// function to handle notification notification
function notification(data) {
    // create new html
    const html =
    `
    <div class="message">
        <div class="message-main">
            <p>${data.username} ${data.message}</p>
        </div>
    </div>
    `
    // insert new html into output container
    output.insertAdjacentHTML('beforeend', html);
}

// function to handle current users in the room
function currentUsers(data) {
    userContainer.innerHTML = '';
    const users = data.users;
    users.forEach( (user) => {
        if(user.room === data.room) {
            const username = `<p>${user.username}</p>`;
            userContainer.insertAdjacentHTML('beforeend', username);
        }
    })
}