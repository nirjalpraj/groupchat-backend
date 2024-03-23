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

io.on("connection", (socket) => {
  console.log("connected!");
  socket.join("anomynous_group");
  socket.on("sendMsg", async (msg) => {
    console.log("🚀 ~ socket.on ~ msg:", msg);

    const Message = new Chat(msg);
    await Message.save();

    io.to("anomynous_group").emit("sendMsgServer", {
      ...msg,
      type: "otherMsg",
    });
    socket.emit("sendMsgServer", { ...msg, type: "otherMsg" });
  });
});

httpServer.listen(3001);
