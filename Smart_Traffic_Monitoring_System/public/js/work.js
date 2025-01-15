const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const server = http.createServer(app);

const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on("send-location", (data) => {
    io.emit("recieve-loaction", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});


app.get('/', (req, res) => {
  res.render('index'); // Render the main page
});

app.get('/about', (req, res) => {
  res.render('about'); // Render 'about.ejs'
});

app.get('/updates', (req, res) => {
  res.render('updates'); // Render 'updates.ejs'
});

app.get('/signin', (req, res) => {
  res.render('signin'); // Render 'signin.ejs'
});

app.get('/signout', (req, res) => {
  res.send('You have been signed out'); // Static message
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
