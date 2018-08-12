const ra = require('redux-act');

module.exports = {
  lobbyMessage: ra.createAction('lobby message added'),
  gameMessage: ra.createAction('game message added'),
  addUser: ra.createAction('added user to system'),
  userLeft: ra.createAction('user disconnected'),
  newGame: ra.createAction('game started'),
  gameOver: ra.createAction(''),
};