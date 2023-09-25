const express = require("express");
const http = require("http");

const connectDB = require("./mongodb/db");

const startServer = require("./utils/startServer");

// Models
const auth = require("./routes/api/auth");
const directMessage = require("./routes/api/chat/directMessage");
const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const contact = require("./routes/api/chat/contact");
const settings = require("./routes/api/settings");
const message = require("./routes/api/chat/message");

// CORS
const cors = require("cors");

//Connect Database
connectDB();
// server creation
const app = express();
// app.use(
//   cors({
//     origin: "*",
//     methodes: ["GET", "POST"],
//     allowedHeaders: ["content-type", "x-auth-token"],
//   })
// );

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Init middleware (Body Parser , now it s included with express )
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/direct-message", directMessage);
app.use("/api/contact", contact);
app.use("/api/settings", settings);
app.use("/api/message", message);

//Set up websocket connection
// io.on('connection', (socket) => {

//     console.log("User is connected")

//     // Event listner for receiving a message from the client
//     socket.on('send_message', async(messageData) => {
//         try {
//             console.log(messageData)
//                 // Emit the message to all connected clients
//             io.emit('receive_message', 'hello')

//         } catch (error) {
//             console.error('Error saving message', error)
//         }
//     })

//     socket.on('disconnect', () => {
//         console.log("A user disconnected")
//     })

// })

io.on("connection", (socket) => {
  //console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.user.id);
    //console.log(userData.user.id);
    socket.emit("connected");
  });

  socket.on("join chat", async (room) => {
    await socket.join("alo");
    //await console.log(room.firstName, "User Joined Room: ");
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", async (newMessageRecieved, userId, leng) => {
    await socket
      .in("alo")
      .emit("message recieved", newMessageRecieved, userId, leng);
  });
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// function that starts server
startServer(server);
