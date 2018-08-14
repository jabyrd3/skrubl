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
    currentWord: '',
    wordPicked: false,
    wordOpts: []
  }
};

export default createReducer({
	[actions.lobbyMessage]: (s, p) => {
		return oa({}, s, {lobbyChat: s.lobbyChat.slice().concat([p.payload])});
	},
	[actions.gameMessage]: (s, p) => {
    return oa({}, s, {game: oa({}, s.game, {chat: s.game.chat.concat([p.payload])})});
	},
	[actions.addUser]: (s, p) => {
    return oa({}, s, {users: s.users.concat([p.payload])})
	},
	[actions.userLeft]: (s, p) => {
    return oa({}, s, {users: p});
	},
	[actions.newGame]: (s, p) => {
    return oa({}, s, {
      game: p,
      lobby: false
    });
	},
	[actions.gameOver]: (s, p) => {
    return oa({}, s, ...freshGame);
	},
  [actions.setLeader]: (s, p) => {
    return oa({}, s, {leader: p});
  },
  [actions.populateState]: (s, p) => {
    return p;
  },
  [actions.editNick]: (s, p) => {
    return oa({}, s, {
      users: s.users.map(u => u.id === p.id ?
        p :
        u) 
    });
  },
  [actions.mergeGame]: (s, p) => {
    return oa({}, s, {
      game: oa({}, s.game, p)
    });
  }
}, {
  users: [],
  lobbyChat: [],
  ...freshGame,
  lobby: false
});