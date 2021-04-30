const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, "../public/");
app.use(express.static(publicDirPath));

let count = 0;

const text = "welcome!";

io.on("connection", (socket) => {
  console.log("new web socket connection");

  socket.emit("message", text); // send pointer to the message event, to chat.js

  socket.broadcast.emit("message", "A New User Has Joined!");

  // receive pointer to formSubmit from chat.js
  socket.on("formSubmit", (message) => {
    io.emit("message", message); // io => send message pointer to all connections
  });

  socket.on("disconnect", () => {
    io.emit("message", "A User Has Left!");
  });

  socket.on("location", (coords) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
