// CONTROLLER IIFE MODULE
let Controller = (function() {
  let state = {
    board: [],
    boardCheck: [],
    currentPlayer: undefined,
    winner: undefined,
  }

  let player1, player2;

  function initGame() {
    state.board = [['', '', ''],['', '', ''],['', '', '']];
    state.boardCheck = [],
    state.currentPlayer = undefined,
    state.winner = undefined,
    player1 = Player(prompt('Enter Player 1 Name:'), 'X');
    player2 = Player(prompt('Enter Player 2 Name:'), 'O');
  }

  function setCurrentPlayer() {
    if (state.currentPlayer === player1) {
      state.currentPlayer = player2;
    } else {
      state.currentPlayer = player1;
    }
  }

  function playRound() {
    let playerMove = prompt(`${state.currentPlayer.name}, please make a selection:`).split('').map((num) => +num);
    if (_isValid(playerMove)) {
      _renderBoard(playerMove);
    } else {
      return playRound();
    }
  }

  function _isValid(moveArr) {
    return state.board[moveArr[0]][moveArr[1]] === '' ? true : false;
  }

  function _renderBoard(playerMove) {
    state.board[playerMove[0]][playerMove[1]] = state.currentPlayer.symbol;
  }

  function isGameOver() {
    state.boardCheck = _getChecks();
    if (_hasWon(state.boardCheck)) {
      state.winner = state.currentPlayer.name;
      return true;
    } else if (_isTie(state.board)) {
      state.winner = "tie";
      return true;
    } else {
      return false;
    }
  }

  function _getChecks() {
    return [
      state.board[0], 
      state.board[1], 
      state.board[2], 
      [state.board[0][0], state.board[1][0], state.board[2][0]],
      [state.board[0][1], state.board[1][1], state.board[2][1]],
      [state.board[0][2], state.board[1][2], state.board[2][2]],
      [state.board[0][0], state.board[1][1], state.board[2][2]],
      [state.board[0][2], state.board[1][1], state.board[2][0]]
    ];
  }

  function _hasWon(boardArr) {
    let symbolCheck = state.currentPlayer.symbol;
    for (let combo of boardArr) {
      if (combo.toString() === [symbolCheck, symbolCheck, symbolCheck].toString()) {
        return true;
      }
    }
    return false;
  }

  function _isTie(boardArr) {
    for (let i of boardArr) {
      for (let j of i) {
        if (j === '') {
          return false;
        }
      }
    }
    return true;
  }

  return {state, initGame, setCurrentPlayer, playRound, isGameOver};
})();


// PLAYER CLASS MODULE
let Player = function(name, symbol) {
  return {name, symbol};
};


// FUTURE UI IIFE MODULE
// let UI = (function() {
// })();


// GAMEPLAY IIFE MODULE
let Gameplay = (function() {
  Controller.initGame();

  let gameOn = true;
  while (gameOn) {
    Controller.setCurrentPlayer();
    Controller.playRound();
    if (Controller.isGameOver()) {
      break;
    }
  }

  console.log(`winner is ${Controller.state.winner}`);

})();