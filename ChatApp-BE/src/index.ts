import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}
let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (e) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(e);
    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
        username: parsedMessage.payload.username,
      });

      // Notify all users in the room about the new user
      const usersInRoom = allSockets.filter(
        (user) => user.room === parsedMessage.payload.roomId
      );
      usersInRoom.forEach((user) => {
        user.socket.send(
          JSON.stringify({
            type: "userJoined",
            payload: {
              username: parsedMessage.payload.username,
              message: `${parsedMessage.payload.username} joined the room`,
              userCount: usersInRoom.length,
            },
          })
        );
      });
    }

    if (parsedMessage.type === "chat") {
      let currentUser = null;
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i]?.socket == socket) {
          currentUser = allSockets[i];
          break;
        }
      }

      if (currentUser) {
        const usersInRoom = allSockets.filter(
          (user) => user.room === currentUser.room
        );
        usersInRoom.forEach((user) => {
          user.socket.send(
            JSON.stringify({
              type: "message",
              payload: {
                username: currentUser.username,
                message: parsedMessage.payload.message,
                timestamp: new Date().toISOString(),
              },
            })
          );
        });
      }
    }
  });

  socket.on("close", () => {
    const userIndex = allSockets.findIndex((user) => user.socket === socket);
    if (userIndex !== -1) {
      const user = allSockets[userIndex];
      if (user) {
        const usersInRoom = allSockets.filter(
          (u) => u.room === user.room && u.socket !== socket
        );

        // Notify other users in the room about user leaving
        usersInRoom.forEach((u) => {
          u.socket.send(
            JSON.stringify({
              type: "userLeft",
              payload: {
                username: user.username,
                message: `${user.username} left the room`,
                userCount: usersInRoom.length,
              },
            })
          );
        });

        allSockets = allSockets.filter((u) => u.socket !== socket);
      }
    }
  });
});
