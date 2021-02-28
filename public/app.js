// make connection
const socket = io.connect('http://localhost:3000/')

// HTML DOM elements
const output = document.querySelector('.output');
//const handle = document.querySelector('#handle');
const message = document.querySelector('#message');
const form = document.querySelector('#chat-form');
const feedback = document.querySelector('.feedback');

// chat form submit eventlistener
form.addEventListener('submit', (e) => {
    // prevent the page from reloading
    e.preventDefault();
    // emit message value to the server
    socket.emit('chat', message.value)
    // reset the message value
    message.value = '';
});

// message input text box event listener
message.addEventListener('keydown', () => {
    // emit message to the server when keydown
    socket.emit('typing', 'Someone is typing...')
})

// catch 'chat' from server
socket.on('chat', (data) => {
    // create a new html
    const html = 
    `
    <div class="message">
        <div class="message-header">
            <p>Ian 2:40pm</p>
        </div>
        <div class="message-main">
            <p>${data}</p>
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
        notification(data);
    }, 1000)
    // reset feedback inner html
    feedback.innerHTML = '';
});

// catch 'joined' from server
socket.on('joined', (data) => {
    notification(data);
});

// catch 'left' from server
socket.on('left', (data) => {
    notification(data);
});

// function to handle all notification
// welcome, joined, left
function notification(data) {
    const html =
    `
    <div class="message">
        <div class="message-main">
            <p>${data}</p>
        </div>
    </div>
    `
    output.insertAdjacentHTML('beforeend', html);
}