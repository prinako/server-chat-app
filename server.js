const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log(id);
  socket.join(id);
  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newReceipients = recipient.filter((r) => r !== recipient);
      newReceipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newReceipient,
        sender: id,
        text,
      });
    });
  });
});

const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`server is runing on port ${port}`));
