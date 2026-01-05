import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 5000;

app.use(express.static(path.join(__dirname, './frontend')));

let roomValues = {};


io.on("connection", (socket) => {
     console.log("User is Connected", socket.id);
     io.emit("userRooms", getRooms());

     socket.on("disconnect", () => {
          console.log("User is Disconnected", socket.id);
          io.emit("userRooms", getRooms());
     });

     socket.on("joinRoom", (room) => {
          // if(!(io.sockets.adapter.rooms.has(room))){
          //      socket.emit("roomNotFound");
          //      return;
          // }
          
          const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;

          if (roomSize >= 2) {
               socket.emit("roomFull");
               return;
          }

          socket.join(room);
          console.log(`${socket.id} joined room ${room}`);
          socket.emit("roomJoined", room);
          io.emit("userRooms", getRooms());
     });        

     socket.on("action", ({value, roomName}) => {
          let rooms = io.sockets.adapter.rooms;

          if(!rooms.has(roomName)){
               socket.emit("roomNotFound");
               console.log("Room Not Found!");
               return;
          }

          if (!roomValues[roomName]) {
               roomValues[roomName] = [];
          }

          roomValues[roomName].push({
               id : socket.id,
               value
          });

          // console.log(roomValues[roomName][0]);

          if(roomValues[roomName].length === 2){
               let result = checkResult(roomValues[roomName][0], roomValues[roomName][1]);

               io.to(roomName).emit("checkResult", {
                    player1: roomValues[roomName][0],
                    player2: roomValues[roomName][1],
                    result
               });                

               roomValues[roomName] = [];
          }
     });

     socket.on("leaveRoom", (roomName) => {
          socket.leave(roomName);
          io.emit("userRooms", getRooms());
     });
});


function getRooms(){
     let sids = io.sockets.adapter.sids;
     let rooms = io.sockets.adapter.rooms;
     let userRooms = [];

     for (let [roomName, members] of rooms) {
          if(!sids.has(roomName)){
               userRooms.push({
                    room : roomName,
                    size : members.size
               });
          }
     }

     // console.log(userRooms);
     return userRooms;
}

const checkResult = (playerOneInput, playerTwoInput) => {
     playerOneInput = playerOneInput.value;
     playerTwoInput = playerTwoInput.value;

     if(playerOneInput === playerTwoInput){
          return "draw";
     }

     if (playerOneInput === "rock" && (playerTwoInput === "scissors" || playerTwoInput === "lizard")) {
          return "player1";
     }
     
     if (playerOneInput === "paper" && (playerTwoInput === "rock" || playerTwoInput === "spock")) {
          return "player1";
     }
     
     if (playerOneInput === "scissors" && (playerTwoInput === "paper" || playerTwoInput === "lizard")) {
          return "player1";
     }
     
     if (playerOneInput === "lizard" && (playerTwoInput === "paper" || playerTwoInput === "spock")) {
          return "player1";
     }
     
     if (playerOneInput === "spock" && (playerTwoInput === "scissors" || playerTwoInput === "rock")) {
          return "player1";
     }
     
     return "player2";
}


app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '/index.html'));
});


server.listen(PORT, (err) => {
     if(err){
          console.log(err);
          return;
     }

     console.log("Server is Running!");
});