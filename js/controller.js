// CONTROLLER IIFE MODULE
let Controller = (function() {
  // obj to be passed as data whenever bound event called
  state = {
    board: [['', '', ''],['', '', ''],['', '', '']],
    player1: {name: '---', symbol: '-', wins: '-'},
    player2: {name: '---', symbol: '-', wins: '-'},
    startingPlayer: undefined,
    currentPlayer: undefined,
  }

  // custom bind events
  Events.on('newGame', createNewGame);
  Events.on('resetGame', wipeState);
  Events.on('rematch', createRematchGame);
  Events.on('playMove', playRound);

  // create Player constructor (factory function)
  function Player(name, symbol) {
    let wins = 0;
    return {name, symbol, wins};
  }

  // module-specific functions
  function createNewGame(dataObj) {
    state.board = [['', '', ''],['', '', ''],['', '', '']];
    state.player1 = Player(dataObj.player1Name, 'X');
    state.player2 = Player(dataObj.player2Name, 'O');
    state.startingPlayer = state.player1;
    state.currentPlayer = state.player1;

    render();
  }

  function wipeState() {
    state.board = [['', '', ''],['', '', ''],['', '', '']];
    state.player1 = {name: '---', symbol: '-', wins: '-'};
    state.player2 = {name: '---', symbol: '-', wins: '-'};
    state.startingPlayer = undefined;
    state.currentPlayer = undefined;

    render();
  }

  function createRematchGame() {
    state.board = [['', '', ''],['', '', ''],['', '', '']];
    state.startingPlayer = changePlayer(state.startingPlayer);
    state.currentPlayer = state.startingPlayer;

    render();
  }

  function changePlayer(player) {
    if (player == state.player1) {
      return state.player2;
    } else {
      return state.player1;
    }
  }

  function playRound(playerMove) {
    state.board[playerMove[0]][playerMove[1]] = state.currentPlayer.symbol;
    let boardChecks = getChecks();

    if (isWin(boardChecks)) {
      state.currentPlayer.wins++;
      Events.emit('gameOver', state.currentPlayer.name);
    } else if (isTie(boardChecks)) {
      Events.emit('gameOver', null);
    } else {
      state.currentPlayer = changePlayer(state.currentPlayer);
    }

    render()
  }

  function isWin(boardArr) {
    let symbolCheck = state.currentPlayer.symbol;
    for (let combo of boardArr) {
      if (combo.toString() === [symbolCheck, symbolCheck, symbolCheck].toString()) {
        return true;
      }
    }
    return false;
  }

  function isTie(boardArr) {
    for (let i of boardArr) {
      for (let j of i) {
        if (j === '') {
          return false;
        }
      }
    }
    return true;
  }

  function getChecks() {
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

  function render() {
    Events.emit('render', state);
  }

  return {state, createNewGame, createRematchGame, wipeState};
})();
