const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const server = http.createServer(app);

const mongoURI = "mongodb+srv://gunjotsingh1616:T4g6puvytn6JxpGQ@cluster0.ifbkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB", error));

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("send-location", async function(data) {
    io.emit("recieve-loaction", { id: socket.id, ...data });

    const { latitude, longitude } = data;
    const location = new Location({ latitude, longitude });

    try {
      await location.save();
      console.log('Location saved to MongoDB');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  });

  socket.on("disconnect", function() {
    io.emit("user-disconnected", socket.id);
  });
});

app.get('/', (req, res) => {
  res.render("index");
});

app.post('/save-location', (req, res) => {
  const { latitude, longitude } = req.body;
  const location = new Location({ latitude, longitude });

  location.save()
    .then(() => res.json({ success: true }))
    .catch((error) => {
      console.error("Error saving location:", error);
      res.json({ success: false });
    });
});

app.get('/check-suspicious-activity', (req, res) => {
  const collection = db.collection('activity');
  
  collection.find({ suspicious: true }).toArray((err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Database error' });
    }
    
    if (result.length > 0) {
      return res.json({ activityFound: true });
    } else {
      return res.json({ activityFound: false });
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
