const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const MessageSchema = new mongoose.Schema({
  user: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
const Message = mongoose.model("Message", MessageSchema);

module.exports = { ChatRoom, Message };
