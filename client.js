// client.js
const socket = io();

// simple UI helpers
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const yourNameSpan = document.getElementById('your-name');
const changeNameBtn = document.getElementById('change-name');

let username = localStorage.getItem('chat_username') || `User${Math.floor(Math.random()*900 + 100)}`;
yourNameSpan.textContent = username;

function addMessageNode(node){
  messages.appendChild(node);
  messages.scrollTop = messages.scrollHeight;
}

function createMessageEl({username: u, message, ts, id}){
  const li = document.createElement('li');
  li.className = (socket.id === id) ? 'message own' : 'message other';
  const meta = document.createElement('div');
  meta.className = 'meta';
  const time = new Date(ts).toLocaleTimeString();
  meta.textContent = `${u} • ${time}`;
  const body = document.createElement('div');
  body.textContent = message;
  li.appendChild(meta);
  li.appendChild(body);
  return li;
}

// system message
function createSystemEl(text){
  const li = document.createElement('li');
  li.className = 'system';
  li.textContent = text;
  return li;
}

// send join event
socket.emit('join', username);

changeNameBtn.addEventListener('click', () => {
  const newName = prompt('Enter display name:', username);
  if (newName && newName.trim().length) {
    username = newName.trim();
    localStorage.setItem('chat_username', username);
    yourNameSpan.textContent = username;
    socket.emit('join', username);
  }
});

// incoming message
socket.on('chat message', (payload) => {
  addMessageNode(createMessageEl(payload));
});

// incoming system
socket.on('system message', (txt) => {
  addMessageNode(createSystemEl(txt));
});

// form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  socket.emit('chat message', val);
  input.value = '';
  input.focus();
});
