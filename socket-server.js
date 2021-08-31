"use strict";

const socketIO = require("socket.io");
const ot = require("ot");
const roomList = {};

module.exports = function (server) {
  let str = "This is a Markdown heading \n\n" + "let i = i + 1;";

  let io = socketIO(server);
  io.on("connection", function (socket) {
    socket.on("joinRoom", function (data) {
      if (!roomList[data.room]) {
        let socketIOServer = new ot.EditorSocketIOServer(
          str,
          [],
          data.room,
          function (socket, cb) {
            let self = this;
            Task.findByIdAndUpdate(
              data.room,
              { content: self.document },
              function (err) {
                if (err) return cb(false);
                cb(true);
              }
            );
          }
        );
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on("chatMessage", function (data) {
      io.to(socket.room).emit("chatMessage", data);
    });

    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
};
