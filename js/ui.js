// PLAYSET MODULE
let Playset = (function() {
  // cache DOM elements
  const input1 = document.querySelector('#player1');
  const input2 = document.querySelector('#player2');
  const startButton = document.querySelector('.start-game');

  const allElements = [input1, input2, startButton];

  // bind default event listeners
  startButton.addEventListener('click', newGame);

  // bind custom event listeners
  Events.on('resetGame', enableComponents);

  // toggle active status
  function enableComponents() {
    for (let element of allElements) {
      element.removeAttribute('disabled');
      element.value = '';
    }
  }

  function disableComponents() {
    for (let element of allElements) {
      element.setAttribute('disabled', true);
      element.value = '';
    }
  }

  // module-specific functions
  function newGame() {
    let player1Name = input1.value.trim();
    let player2Name = input2.value.trim();

    if (player1Name && player2Name) {
      Events.emit('newGame', {player1Name, player2Name});
      disableComponents();
    } else {
      Events.emit('error', '❌ You need to fill out both names ❌!');
    }
  }

  return {enableComponents, disableComponents};
})();


// CONTROL MODULE
let Control = (function() {
  // cache DOM elements
  const box1 = document.querySelector('.profile.one');
  const name1 = document.querySelector('.name.one');
  const wins1 = document.querySelector('.wins.one');

  const box2 = document.querySelector('.profile.two');
  const name2 = document.querySelector('.name.two');
  const wins2 = document.querySelector('.wins.two');

  // bind custom events
  Events.on('render', refreshModule);

  // module-specific functions
  function refreshModule(dataObj) {
    updateStats(dataObj);
    showActivePlayer(dataObj);
  }

  function updateStats(state) {
    name1.textContent = state.player1.name;
    wins1.textContent = state.player1.wins;
    name2.textContent = state.player2.name;
    wins2.textContent = state.player2.wins;
  }

  function showActivePlayer(state) {
    if (state.currentPlayer) {
      if (state.currentPlayer.symbol === 'X') {
        box1.classList.add('active');
        box2.classList.remove('active');
      } else if (state.currentPlayer.symbol === 'O') {
        box1.classList.remove('active');
        box2.classList.add('active');
      }
    } else {
      box1.classList.remove('active');
      box2.classList.remove('active');
    }
  }

})();


// GAME MODULE
let Gameboard = (function() {

  // cache DOM elements
  const gameBoard = document.querySelector('.game');
  const allTiles = Array.from(gameBoard.children);

  // bind custom event listeners
  Events.on('newGame', enableGame);
  Events.on('rematch', enableGame);
  Events.on('resetGame', disableGame);
  Events.on('gameOver', disableGame);
  Events.on('render', showBoard);

  // module-specific functions
  function enableGame() {
    gameBoard.classList.add('active')
    gameBoard.addEventListener('mouseover', onHover);
    gameBoard.addEventListener('click', onClick);
  }

  function disableGame() {
    gameBoard.classList.remove('active')
    gameBoard.removeEventListener('mouseover', onHover);
    gameBoard.removeEventListener('click', onClick);

    for (let tile of allTiles) {
      tile.removeAttribute('class');
    }
  }

  function onHover(e) {
    let tileClass;
    if (e.target.textContent === '') {
      tileClass = 'available'
      e.target.textContent = Controller.state.currentPlayer.symbol;
    } else {
      tileClass = 'unavailable'
    }

    e.target.classList.add(tileClass);
    e.target.addEventListener('mouseout', removeTileStyling);
  }

  function removeTileStyling(e) {
    if (e.target.classList.contains('available')) {
      e.target.textContent = '';
    }

    e.target.classList.remove('available');
    e.target.classList.remove('unavailable');
    e.target.removeEventListener('mouseout', removeTileStyling);
  }

  function onClick(e) {
    if (e.target.classList.contains('available')) {
      e.target.classList.remove('available');
      e.target.classList.add('unavailable');

      let position = e.target.getAttribute('data-pos').split('').map((str) => +str);
      Events.emit('playMove', position);
    } else {
      Events.emit('error', '❌ That space is already taken ❌!');
    }
  }

  function showBoard(state) {
    const flatBoard = state.board.flat();
    for (let i = 0; i < allTiles.length; i++) {
      allTiles[i].textContent = flatBoard[i];
    }
  }

})();


// MESSAGE DIALOG MODULE
let Dialog = (function() {
  // cache DOM elements
  const dialog = document.querySelector('.message-generator');

  // bind custom events
  Events.on('newGame', newGame);
  Events.on('resetGame', resetGame);
  Events.on('rematch', rematch);
  Events.on('gameOver', gameOver);
  Events.on('playMove', playMove);
  Events.on('error', error);

  // module-specific functions
  function newGame() {
    dialog.textContent = `🛡️ May the best Tic-Tac-Toer win... 🛡️`;
  }

  function resetGame() {
    dialog.textContent = '🙏 Give yourselves some names! 🙏';
  }

  function rematch() {
    dialog.textContent = `🥊 New round... FIGHT! 🥊`;
  }

  function gameOver(player) {
    if (player) {
      dialog.textContent = `🧹 Congrats to ${player} on the SWEEP 🧹`;
    } else {
      dialog.textContent = '👨‍💼 TIE GAME, looks like you both suck! 👨‍💼';
    }
  }

  function playMove() {
    dialog.textContent = '🤔 Interesting move... 🤔';
  }

  function error(msg) {
    dialog.textContent = msg;
  }

})();

// RESET BUTTON MODULE
let PlayOptions = (function() {
  // cache DOM elements
  const rematchButton = document.querySelector('.rematch');
  const resetButton = document.querySelector('.reset');

  // bind default event listeners
  resetButton.addEventListener('click', resetGame);

  // bind custom event listeners
  Events.on('gameOver', enableRematch);

  // module-specific functions
  function enableRematch() {
    rematchButton.classList.add('active');
    rematchButton.addEventListener('click', disableRematch);
  }

  function disableRematch() {
    rematchButton.classList.remove('active');
    rematchButton.removeEventListener('click', disableRematch);

    Events.emit('rematch', null);
  }

  function resetGame() {
    disableRematch();

    Events.emit('resetGame', null);
  }

})();
