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

export default checkResult;