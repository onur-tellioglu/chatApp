let username;
let chatroomId;

// When the page loads, show the username input
window.onload = () => {
  document.getElementById("usernameDiv").style.display = "block";
};

// When the user clicks "Next", move to chatroom selection
function selectChatroom() {
  username = document.getElementById("username").value;

  // Show the chatroom selector and hide the username input
  document.getElementById("usernameDiv").style.display = "none";
  document.getElementById("chatroomSelector").style.display = "block";
}

function startChat(chatroomName) {
  chatroomId = chatroomName;
  document.getElementById("chatroomTitle").textContent = chatroomName;

  // Show the chatroom and hide the chatroom selector
  document.getElementById("chatroomSelector").style.display = "none";
  document.getElementById("chatroomDiv").style.display = "block";

  fetchMessages();

  setInterval(fetchMessages, 500);

  // Allow the user to send new messages
  let input = document.getElementById("input");

  // Sending message by pressing Enter
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the default action
      sendMessage();
    }
  });

  // Sending message by clicking the Send button
  document.getElementById("sendButton").addEventListener("click", sendMessage);
}

function sendMessage() {
  let content = document.getElementById("input").value;
  if (content.trim() !== "") {
    // Prevents empty messages
    fetch(`http://localhost:3000/message/${chatroomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: username,
        content: content,
      }),
    }).then(() => {
      document.getElementById("input").value = "";
      fetchMessages(); // Fetch messages again after sending a new one
    });
  }
}

// Post a new message to a specific chatroom
app.post("/message/:name", (req, res) => {
  let newMessage = new Message({
    user: req.body.user,
    content: req.body.content,
  });

  newMessage
    .save()
    .then(() => {
      return ChatRoom.findOneAndUpdate(
        { name: req.params.name },
        { $push: { messages: newMessage } }
      );
    })
    .then(() => res.send(newMessage))
    .catch((err) => console.log(err));
});

fetch(`http://localhost:3000/message/${chatroomId}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user: username,
    content: content,
  }),
});

function fetchMessages() {
  fetch(`http://localhost:3000/chatroom/${chatroomId}`)
    .then((response) => response.json())
    .then((chatroom) => {
      let chatroomDiv = document.getElementById("messages"); // Change 'chatroom' to 'messages'
      chatroomDiv.textContent = ""; // Clear the chatroom

      // Show each message in the chatroom
      for (let message of chatroom.messages) {
        let messageDiv = document.createElement("div");
        messageDiv.textContent = `${message.user}: ${message.content}`;
        chatroomDiv.appendChild(messageDiv);
      }
    });
}
