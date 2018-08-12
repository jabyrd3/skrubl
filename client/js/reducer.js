import {createReducer} from 'redux-act';
import * as actions from './actions';
const oa = Object.assign;
const ok = Object.keys;
const freshGame = {
  game: {
    // array of socket ids
    currentCorrect: [],
    // int, represents current round
    currentRound: 0,
    // array of id: score pairs
    scores: [],
    // current drawer, id
    drawer: '',
    // array of ids representing users who guessed correct
    guesses: [],
    // current chat stream
    chat: [],
    // array of ids representing those who have drawn
    drawn: [],
    // current guess word
    currentWord: ''
  }
};

export default createReducer({
	[actions.lobbyMessage]: (s, p) => {
		return oa(s, lobbyChat.concat([p.body]));
	},
	[actions.gameMessage]: (s, p) => {
	},
	[actions.addUser]: (s, p) => {
	},
	[actions.userLeft]: (s, p) => {
	},
	[actions.newGame]: (s, p) => {
	},
	[actions.gameOver]: (s, p) => {

	},
  [actions.populateState]: (s, p) => {
    return p;
  }
}, {
  users: [],
  lobbyChat: [],
  ...freshGame,
  lobby: false
});