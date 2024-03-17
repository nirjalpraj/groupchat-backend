const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.route("/").get((req, res) => {
  res.json("Testing testing");
});

io.on("connection", (socket) => {
  socket.join("anomynous_group");
  console.log("Backend connected!");
  socket.on("sendMsg", (msg) => {
    console.log("Here is the msg", msg);
    io.to("anomynous_group").emit("sendMsgServer", {
      ...msg,
      type: "otherMsg",
    });
    // socket.emit("sendMsgServer", { ...msg, type: "otherMsg" });
  });
});

httpServer.listen(3000);
