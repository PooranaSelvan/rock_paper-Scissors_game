let oneplayerMode = document.getElementById("onePlayerMode");
let modeContainer = document.getElementById("modeContainer");
let outputContainer = document.getElementById("outputContainer");
let outputPlayer1 = document.getElementById("outputPlayer1");
let finalOutput = document.getElementById("output");
let restart = document.getElementById("restart");
let restartBtn = document.getElementById("restart-btn");
let exitBtn = document.getElementById("exit-btn");
let outputSelection = document.getElementById("outputSelection1");
let computerOutput = document.getElementById("outputComputer");
let availableRooms = document.getElementById("a-rooms");


// Socket Buttons
let createRoom = document.getElementById("create-btn");
let joinRoom = document.getElementById("join-btn");
let joinRoomInput = document.getElementById("join-room-input");
let roomContainer = document.getElementById("roomName");


let player1Score = 0;
let player2Score = 0;
let player1Choice = "";
let mode = 0;
let choices = ["rock", "paper", "scissors", "lizard", "spock"];


const clientSocket = io();
let roomName = "";


// Socket
// Create Room
createRoom.addEventListener("click", () => {
     roomName = "";

     for(let i = 0; i < 5; i++){
          roomName += Math.floor(Math.random() * 5) * 1;
     }

     joinUserRoom();
});
// Join Room
joinRoom.addEventListener("click", () => {
     if(!joinRoomInput.value || joinRoomInput.value.length !== 5){
          Notiflix.Notify.failure("Invalid Room Number!!");
          return;
     }
     roomName = joinRoomInput.value;

     joinUserRoom();
});
// Joining Socket
function joinUserRoom(){
     mode = 2;
     
     roomContainer.innerText = "ROOM CODE : " + roomName;
     clientSocket.emit("joinRoom", roomName);
}
// Leaving Socket
function leaveRoom(){
     clientSocket.emit("leaveRoom", roomName);
     Notiflix.Notify.failure("Left a Room!");
}
// Afteer Joined
clientSocket.on("roomJoined", (room) => {
     modeContainer.style.display = "none";
     outputContainer.style.display = "flex";
     restart.style.display = "flex";
     document.getElementById("outputComputer").style.display = "flex";
     exitBtn.innerText = "Leave Room";
     restartBtn.style.display = "none";

     roomName = room;
     Notiflix.Notify.success("Joined a Room!");
});
// Validate result
clientSocket.on("checkResult", ({ player1, player2, result }) => {
     computerOutput.innerHTML = "";
     if(clientSocket.id === player1.id){
          let player2Element = document.querySelector("." + player2.value).cloneNode(true);
          computerOutput.append(player2Element);
     } else {
          let player1Element = document.querySelector("." + player1.value).cloneNode(true);
          computerOutput.append(player1Element);
     }

     // console.log(player1, player2, result);

     if(result === "draw"){
          finalOutput.style.color = "#ffaa00";
          finalOutput.innerText = "Draw !!";
     } else if((result === "player1" && clientSocket.id === player1.id) || (result === "player2" && clientSocket.id === player2.id)){
         finalOutput.style.color = "deepskyblue";
         finalOutput.innerText = "You Won";
     } else {
         finalOutput.style.color = "red";
         finalOutput.innerText = "You Lose";
     }

     calculatePlayerScore(result, clientSocket.id === player1.id);
     outputSelection.addEventListener("click", userSelect);
     document.getElementById("loader-container").style.display = "none";
});
clientSocket.on("roomFull", () => {
     console.log("Room Full!");
     roomName = "";

     Notiflix.Notify.failure("Room Full!");
});
clientSocket.on("roomNotFound", () => {
     Notiflix.Notify.failure("Room Not Found!");
});
clientSocket.on("userRooms", (rooms) => {
     if(rooms.length < 1){
          availableRooms.innerText = "No Available Rooms Found!";
          return;
     }

     availableRooms.innerHTML = "";

     let arr = rooms.filter(ele => ele.size < 2);

     if (arr.length === 0) {
          availableRooms.innerText = "No Available Rooms Found!";
          return;
     }

     for(let i = 0; i < arr.length; i++){
          let div = document.createElement("div");
          div.className = arr[i].room;
          div.classList.add("room");
          
          let localRoomName = document.createElement("h1");
          localRoomName.innerHTML = arr[i].room;

          let roomMsg = document.createElement("p");
          roomMsg.innerText = "ROOM CODE";

          let roomLine = document.createElement("hr");

          let roomSize = document.createElement("p");
          roomSize.innerHTML = '<i class="fa-solid fa-users"></i> ';
          roomSize.innerHTML += arr[i].size;

          let joinBtn = document.createElement("button");
          joinBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i>';
          joinBtn.className = "a-room-btn";

          let roomWrapper = document.createElement("div");
          roomWrapper.className = "room-wrapper";

          roomWrapper.append(roomSize, joinBtn);

          div.append(localRoomName, roomMsg, roomLine, roomWrapper);

          availableRooms.append(div);
     }

     document.querySelectorAll(".a-room-btn").forEach(ele => {
          ele.removeEventListener("click", joinUserRoom);
     });


     document.querySelectorAll(".a-room-btn").forEach(ele => {
          ele.addEventListener("click", (e) => {
               let rName = e.target.parentElement.parentElement.parentElement.className.split(" ")[0];
               roomName = rName;
               joinUserRoom();
          });
     });
});

outputSelection.addEventListener("click", userSelect);

function userSelect(e) {
     outputPlayer1.innerText = "";
     finalOutput.innerText = '';
     player1Choice = '';
     let sendTo = "";
     let choiceDiv = null;

     if(e.target.tagName === "IMG"){
          sendTo = e.target.parentElement;
          player1Choice = e.target.parentElement.className;
          choiceDiv = e.target.parentElement;
     }
     else if(e.target.className === "rock" || e.target.className === "paper" || e.target.className === "scissors" || e.target.className === "lizard" || e.target.className === "spock"){
          choiceDiv = e.target;
          sendTo = e.target;
     } else {
          return;
     }

     player1Choice = choiceDiv.className;

     if(mode === 1){
          outputPlayer1.append(sendTo.cloneNode(true));
          calculateSinglePlayerResult(player1Choice);
     } else if(mode === 2){
          // console.log(player1Choice);
          clientSocket.emit("action", {
              value: player1Choice,
              roomName
          });
     
          outputSelection.removeEventListener("click", userSelect);
          document.getElementById("loader-container").style.display = "flex";
          outputPlayer1.append(sendTo.cloneNode(true));
     }
}
function calculatePlayerScore(result, isPlayer1){
     if(result === "draw"){
          return;
     };
 
     if((result === "player1" && isPlayer1) || (result === "player2" && !isPlayer1)){
         player1Score += 1;
     } else {
         player2Score += 1;
     }
 
     document.getElementById("playerScore").querySelector("h1").innerText = player1Score;
     document.getElementById("computerScore").querySelector("h1").innerText = player2Score;
} 
function calculateSinglePlayerResult(playerInput){
     let computerInput = choices[Math.floor(Math.random() * ((choices.length) - 0) + 0)];

     let ele = document.querySelector("#outputSelection1");
     document.getElementById("outputComputer").innerHTML = "";

     ele.querySelectorAll("div").forEach(ele => {
          if(ele.className === computerInput){
               document.getElementById("outputComputer").append(ele.cloneNode(true));
          }
     })

     finalOutput.style.color = "deepskyblue";
     
     if(playerInput === computerInput){
          finalOutput.style.color = "#ffaa00";
          finalOutput.innerText = "Draw !!";
     } else if(playerInput === "rock" && (computerInput === "scissors" || computerInput === "lizard")){
          finalOutput.innerText = "You Won !!";
          player1Score += 1;
     } else if(playerInput === "paper" && (computerInput === "rock" || computerInput === "spock")){
          finalOutput.innerText = "You Won !!";
          player1Score += 1;
     } else if(playerInput === "scissors" && (computerInput === "paper" || computerInput === "lizard")){
          finalOutput.innerText = "You Won !!";
          player1Score += 1;
     } else if(playerInput === "lizard" && (computerInput === "paper" || computerInput === "spock")){
          finalOutput.innerText = "You Won !!";
          player1Score += 1;
     } else if(playerInput === "spock" && (computerInput === "scissors" || computerInput === "rock")){
          finalOutput.innerText = "You Won !!";
          player1Score += 1;
     } else {
          finalOutput.style.color = "red";
          finalOutput.innerHTML = "You Lose !!";
          player2Score += 1;
     }

     document.getElementById("playerScore").querySelector("h1").innerText = player1Score;
     document.getElementById("computerScore").querySelector("h1").innerText = player2Score;
}


// Single Player Mode
oneplayerMode.addEventListener("click", () => {
     modeContainer.style.display = "none";
     outputContainer.style.display = "flex";
     restart.style.display = "flex";
     roomContainer.innerText = "SINGLE PLAYER MODE";
     mode = 1;
     document.getElementById("playerOneOutputContainer").style.flexDirection = "column";
     document.getElementById("outputComputer").style.display = "flex";
     outputSelection.addEventListener("click", userSelect);
     Notiflix.Notify.success("Match Started!");
     exitBtn.innerText = "Exit Game";
});


// Button Actions
restartBtn.addEventListener("click", () => {
     if(mode === 2){
          leaveRoom();
          joinUserRoom();
     }

     player1Score = 0;
     player2Score = 0;
     outputPlayer1.innerHTML = "";
     finalOutput.innerText = "";
     document.getElementById("outputComputer").innerHTML = "";
     

     document.getElementById("playerScore").querySelector("h1").innerText = player1Score;
     document.getElementById("computerScore").querySelector("h1").innerText = player2Score;
});


exitBtn.addEventListener("click", () => {
     if(mode === 2){
          leaveRoom();
     }

     player1Score = 0;
     player2Score = 0;
     mode = 0;

     document.getElementById("playerScore").querySelector("h1").innerText = '';
     document.getElementById("computerScore").querySelector("h1").innerText = '';
     
     finalOutput.innerText = '';
     outputPlayer1.innerText = '';
     player1Choice = '';
     

     outputContainer.style.display = "none";
     modeContainer.style.display = "flex";
     restart.style.display = "none";

     outputSelection.removeEventListener("click", userSelect);
     document.getElementById("outputComputer").innerHTML = "";
});