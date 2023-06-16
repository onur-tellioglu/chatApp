const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ChatRoom, Message } = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://onurusav12:gYEvO0BUBrHen0wc@chatapp.yh2elpo.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB Atlas: ", error);
  });

app.get("/chatroom/:name", (req, res) => {
  ChatRoom.findOne({ name: req.params.name })
    .populate("messages")
    .then((chatroom) => res.send(chatroom))
    .catch((err) => console.log(err));
});

app.post("/message/:chatroomId", async (req, res) => {
  const message = new Message(req.body);
  await message.save();

  let chatroom = await ChatRoom.findOne({ name: req.params.chatroomId });

  if (!chatroom) {
    // If the chatroom does not exist, create a new one
    chatroom = new ChatRoom({
      name: req.params.chatroomId,
      messages: [message],
    });
  } else {
    // If the chatroom exists, push the new message into the messages array
    chatroom.messages.push(message);
  }

  await chatroom.save();

  res.json(message);
});

app.listen(3000, () => console.log("Server started on port 3000"));
