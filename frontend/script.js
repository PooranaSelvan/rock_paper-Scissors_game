let oneplayerMode = document.getElementById("onePlayerMode");
let twoPlayerMode = document.getElementById("twoPlayerMode");
let modeContainer = document.getElementById("modeContainer");
let outputContainer = document.getElementById("outputContainer");
let outputPlayer1 = document.getElementById("outputPlayer1");
// let outputPlayer2 = document.getElementById("outputPlayer2");
let finalOutput = document.getElementById("output");
let restart = document.getElementById("restart");
let restartBtn = document.getElementById("restart-btn");
let exitBtn = document.getElementById("exit-btn");

// Socket Buttons
let createRoom = document.getElementById("create-btn");
let joinRoom = document.getElementById("join-btn");
let createRoomInput = document.getElementById("create-room-input");
let joinRoomInput = document.getElementById("join-room-input");


let choices = ["rock", "paper", "scissors", "lizard", "spock"];

let mode = 0;
let player1Score = 0;
let player2Score = 0;

let playerOneInput = '';
let playerTwoInput = '';

let player1Choice = "";
let player2Choice = "";

const clientSocket = io();
let roomName = "";


// Socket
createRoom.addEventListener("click", () => {
     for(let i = 0; i < 5; i++){
          roomName += Math.floor(Math.random() * 5) * 1;
     }

     createRoomInput.value = roomName;
     createRoomInput.style.opacity = 1;

     clientSocket.emit("joinRoom", roomName);
});
joinRoom.addEventListener("click", () => {
     if(!joinRoomInput.value || joinRoomInput.value.length !== 5){
          return;
     }

     roomName = joinRoomInput.value;
     
     modeContainer.style.display = "none";
     outputContainer.style.display = "flex";
     restart.style.display = "flex";

     clientSocket.emit("joinRoom", roomName);
});
clientSocket.on("checkResult", ({ player1, player2, result }) => {
     outputPlayer1.innerHTML = "";

     // console.log(player1, player2, result);

     if(result === "draw"){
          finalOutput.style.color = "#ffaa00";
          finalOutput.innerText = "Draw !!";
     } else if((result === "player1" && clientSocket.id === player1) || (result === "player2" && clientSocket.id === player2)){
         finalOutput.style.color = "deepskyblue";
         finalOutput.innerText = "You Won";
     } else {
         finalOutput.style.color = "red";
         finalOutput.innerText = "You Lose";
     }
});

let input1 = document.querySelector("#outputSelection1");     
input1.addEventListener("click", twoPlayer1);

// One Player Mode
oneplayerMode.addEventListener("click", () => {
     mode = 1;

     modeContainer.style.display = "none";
     outputContainer.style.display = "flex";
     restart.style.display = "flex";

     let ele = document.querySelector("#outputSelection1");

     // console.log(ele);

     ele.addEventListener("click", onePlayer);

});
function onePlayer(e){
     outputPlayer1.innerText = "";
     let sendTo = "";
     let player1Choic = '';

     if(e.target.tagName === "IMG"){
          sendTo = e.target.parentElement;
          player1Choic = e.target.parentElement.className;
     }
     else if(e.target.className === "rock" || e.target.className === "paper" || e.target.className === "scissors" || e.target.className === "lizard" || e.target.className === "spock"){
          sendTo = e.target;
          player1Choic = e.target.className;
     } else {
          return;
     }

     // console.log(player1Choic);
     outputPlayer1.append(sendTo.cloneNode(true));
     playerVSComputer(player1Choic);
}



// Two Player Mode
twoPlayerMode.addEventListener("click", () => {
     mode = 2;

     modeContainer.style.display = "none";
     outputContainer.style.display = "flex";
     restart.style.display = "flex";

     // let input1 = document.querySelector("#outputSelection1");
     // let input2 = document.querySelector("#outputSelection2");
     
     // input1.addEventListener("click", twoPlayer1);
     // input2.addEventListener("click", twoPlayer2);
     
});
function twoPlayer1(e) {
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

     // console.log(player1Choice);
     clientSocket.emit("action", {
         value: player1Choice,
         roomName
     });

     outputPlayer1.append(sendTo.cloneNode(true));
}
// function twoPlayer2 (e){
//      outputPlayer2.innerText = "";
//      finalOutput.innerText = '';
//      player2Choice = '';
//      let sendTo = "";

//      if(e.target.tagName === "IMG"){
//           sendTo = e.target.parentElement;
//           player2Choice = e.target.parentElement.className;
//      }
//      else if(e.target.className === "rock" || e.target.className === "paper" || e.target.className === "scissors" || e.target.className === "lizard" || e.target.className === "spock"){
//           sendTo = e.target;
//           player2Choice = e.target.className;
//      } else {
//           return;
//      }
//      outputPlayer2.append(sendTo.cloneNode(true));
// }


// Result
const checkResult = (playerOneInput, playerTwoInput) => {

     // console.log(playerOneInput, playerTwoInput);


     finalOutput.style.color = "deepskyblue";

     if(playerOneInput === playerTwoInput){
          finalOutput.style.color = "#ffaa00";
          finalOutput.innerText = "Draw !!";
     } else if(playerOneInput === "rock" && (playerTwoInput === "scissors" || playerTwoInput === "lizard")){
          if(mode === 1){
               finalOutput.innerText = "You Won !!";
               player1Score += 1;
          } else {
               finalOutput.innerText = "Player 1 Wins";
               player1Score += 1;
          }
     } else if(playerOneInput === "paper" && (playerTwoInput === "rock" || playerTwoInput === "spock")){
          if(mode === 1){
               finalOutput.innerText = "You Won !!";
               player1Score += 1;
          } else {
               finalOutput.innerText = "Player 1 Wins";
               player1Score += 1;
          }
     } else if(playerOneInput === "scissors" && (playerTwoInput === "paper" || playerTwoInput === "lizard")){
          if(mode === 1){
               finalOutput.innerText = "You Won !!";
               player1Score += 1;
          } else {
               finalOutput.innerText = "Player 1 Wins";
               player1Score += 1;
          }
     } else if(playerOneInput === "lizard" && (playerTwoInput === "paper" || playerTwoInput === "spock")){
          if(mode === 1){
               finalOutput.innerText = "You Won !!";
               player1Score += 1;
          } else {
               finalOutput.innerText = "Player 1 Wins";
               player1Score += 1;
          }
     } else if(playerOneInput === "spock" && (playerTwoInput === "scissors" || playerTwoInput === "rock")){
          if(mode === 1){
               finalOutput.innerText = "You Won !!";
               player1Score += 1;
          } else {
               finalOutput.innerText = "Player 1 Wins";
               player1Score += 1;
          }
     } else {
          if(mode === 1){
               finalOutput.style.color = "red";
               finalOutput.innerHTML = "You Lose !!";
               player2Score += 1;
          } else {
               finalOutput.innerText = "Player 2 Wins";
               player2Score += 1;
          }
     }

     // console.log(player1Score, player2Score);

     document.getElementById("playerScore").querySelector("h1").innerText = player1Score;
     document.getElementById("computerScore").querySelector("h1").innerText = player2Score;
}

// Choices
// const playerVSComputer = (player1Choice) => {
//      // console.log(player1Choice);
//      playerOneInput = player1Choice;
//      playerTwoInput = choices[Math.floor(Math.random() * ((choices.length) - 0) + 0)];

//      let ele = document.querySelector("#outputSelection2");

//      outputPlayer2.innerText = '';
//      ele.querySelectorAll("div").forEach(ele => {
//           if(ele.className === playerTwoInput){
//                outputPlayer2.append(ele.cloneNode(true));
//           }
//      });

//      console.log("Player VS Comp");
//      checkResult(playerOneInput, playerTwoInput);
// }


const playerVSPlayer = (player1Choice, player2Choice) => {
     playerOneInput = player1Choice;
     playerTwoInput = player2Choice;

     checkResult(playerOneInput, playerTwoInput);
}



// Button Actions
restartBtn.addEventListener("click", () => {
     player1Score = 0;
     player2Score = 0;

     document.getElementById("playerScore").querySelector("h1").innerText = '';
     document.getElementById("computerScore").querySelector("h1").innerText = '';
     finalOutput.innerText = '';
     outputPlayer1.innerText = '';
     // outputPlayer2.innerText = '';
});


exitBtn.addEventListener("click", () => {

     player1Score = 0;
     player2Score = 0;

     document.getElementById("playerScore").querySelector("h1").innerText = '';
     document.getElementById("computerScore").querySelector("h1").innerText = '';
     finalOutput.innerText = '';
     outputPlayer1.innerText = '';
     // outputPlayer2.innerText = '';
     playerOneInput = '';
     playerTwoInput = '';
     player1Choice = '';
     player2Choice = '';
     

     outputContainer.style.display = "none";
     modeContainer.style.display = "flex";
     restart.style.display = "none";

     let player1Remove = document.querySelector("#outputSelection1");
     player1Remove.removeEventListener("click", onePlayer);

     let player2Remove = document.querySelector("#outputSelection2");
     player2Remove.removeEventListener("click", twoPlayer1);
     player2Remove.removeEventListener("click", twoPlayer2);
});