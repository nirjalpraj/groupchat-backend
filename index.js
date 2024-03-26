import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/db/index.js";
import { Chat } from "./src/models/chatModel.js";

dotenv.config({
  path: "./",
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

connectDB();

app.route("/").get((req, res) => {
  res.json("Testing testing");
});

let roomId = "";

io.on("connection", (socket) => {
  console.log("connected!");
  // socket.join("anomynous_group");

  socket.on("join", (room) => {
    socket.join(room);
    roomId = room;
    console.log("🚀 ~ socket.on ~ roomId:", roomId);
  });

  socket.on("sendMsg", async (msg) => {
    console.log("🚀 ~ socket.on ~ msg:", msg);
    console.log("🚀 ~ roomId:", roomId);
    const Message = new Chat({ msg: msg.msg, sender: msg.userId });
    Message.save();

    io.to(roomId).emit("sendMsgServer", {
      ...msg,
      type: "otherMsg",
    });
    socket.emit("sendMsgServer", { ...msg, type: "otherMsg" });
  });

  Chat.find()
    .sort("-createdAt")
    .limit(10)
    .then((messages) => {
      // console.log("🚀 ~ .then ~ messages:", messages);
      socket.emit("chat history", messages.reverse());
    })
    .catch((err) => {
      console.error("Error fetching chat history:", err);
    });
});

httpServer.listen(3001);
