const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/message");
const { generateLocationMessage } = require("./utils/generateLocationMessage");

// server setup for socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

// static dir setup
const publicDirPath = path.join(__dirname, "../public/");
app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("new web socket connection");

  // send pointer to the message event, to chat.js
  socket.emit("message", generateMessage("Welcome"));
  socket.broadcast.emit("message", generateMessage("A new user has joined"));

  // receive pointer to formSubmit from chat.js
  socket.on("formSubmit", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("profanity not allowed!");
    }

    io.emit("message", generateMessage(message)); // io => send message pointer to all connections
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A User Has Left!"));
  });

  socket.on("location", (coords, callback) => {
    io.emit("locationMessage", generateLocationMessage(coords));
    callback();
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
