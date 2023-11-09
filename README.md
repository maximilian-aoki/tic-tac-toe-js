# tic-tac-toe-js
An in-browser Tic Tac Toe game, made with vanilla JS, CSS, and JS. Uses a Publish Subscribe module pattern to pass information and state between multiple components.

FEATURES:
- two-player game with rematches and resets
- ability to enter names
- sleek gameboard ui
- stats board
- fun in-game message board!

PUBSUB EVENTS:
'newGame'
- emit from Playset with obj containing player1 name and player2 name
- bind Gameboard to enable event listeners on board
- bind Controller to set state for a FRESH game - EMITS RENDER

'resetGame'
- emit from RESET button - general emit
- bind Playset to enable components
- bind Gameboard to disable event listeners on board
- bind Controller to set default state - EMITS RENDER

'rematch'
- emit from REMATCH button - general emit
- bind Controller to set state for a new game with same players - EMITS RENDER
- bind Gameboard to re-enable upon rematch

'render'
- emit from Controller with current state obj
- bind Gameboard to show the board array, adding text content to the HTML divs
- bind Control to show game stats and active player

'playMove'
- emit from Gameboard
- bind Controller to analyse move

'gameOver'
- emit from Controller once game is over
- bind REMATCH button to show and activate the button
- bind Gameboard to disable upon game over

'error'
- emit from Playset if both names not filled out
- emit from Gameboard if trying to click a non-avail area
- bind to Dialog for all reasons
