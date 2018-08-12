//skrubl server, self-hosted skribl.io clone

//support this fun / weird pattern
const oa = Object.assign;
const _ = require('lodash');
const redux = require('redux');
const act = require('redux-act');
const actions = require('./actions');

// express & socket boilerplate
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
server.listen(3000, '127.0.0.1');

// serve client
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// constant to reset game chunk of store
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

// spawn store, bit ugly
const store = redux.createStore(act.createReducer({
  [actions.lobbyMessage]: (s, p) => 
    oa({}, s, {
      lobbyChat: s.lobbyChat.concat([p])
    }),
  [actions.gameMessage]: (s, p) => 
    // test if message includes correct word, if so, add user to game.guesses
    oa(s, {
      game: oa({}, s, {
        chat: s.game.chat.concat(p),
        currentCorrect: p.body.indexOf(s.game.currentWord) > -1 ?
          s.game.currentCorrect.concat([p.id]) :
          s.game.currentCorrect
    })}),
  [actions.addUser]: (s, p) =>
    oa({}, s, {
      users: s.users.concat([p])
    }),
  [actions.editNick]: (s, p) => 
    oa({}, s, {
      users: s.users.map(u =>
        u.id !== p.id ?
          u :
          {[u.id]: u.nick})
    }), 
  [actions.userLeft]: (s, p) =>
    oa({}, s, {
      users: s.users.filter(u => p.id === u.id)
    }),
  [actions.newGame]: (s, p) =>
    oa({}, s, {lobby: false}, {
      ...freshGame 
    }),
  [actions.gameOver]: (s, p) =>
    oa({}, s, {lobby: true}, {
      ...freshGame
    }),
  [actions.startDraw]: (s, p) =>
    // timer is goooo
    oa({}, s, {}),
  [actions.drawOver]: (s, p) =>
    // add current game.drawer to game.drawn, pick new drawer,
    // set new drawer who isn't in drawn, set currentCorrect to nill
    oa({}, s, {
      game: oa({}, s.game, {
        drawn: s.game.drawn.concat([s.game.drawer])
      })
    }),
  [actions.newDrawer]: (s, p) =>
    oa({}, s, {
      game: oa({}, s, {
        drawer: s.users.find(u => s.game.drawn.indexOf(u.id) === -1)
      })
    }),
  [actions.roundOver]: (s, p) => 
    oa({}, s, {
      game: oa({}, s.game, {
        currentWord: '',
        currentRound: s.game.currentRound + 1,
        drawn: []
      })
    })
}, {
  users: [],
  lobbyChat: [],
  ...freshGame,
  lobby: false
}));

io.on('connection', (s) => {
  io.emit(store.dispatch(actions.addUser(s.id)))
  // console.log(s.id)
  s.on('lobbyMessage', (m) => socket.emit(store.dispatch(actions.lobbyMessage(m))));
  s.on('gameMessage', (m) => socket.emit(store.dispatch(actions.gameMessage(m))));
  s.on('pickWord', (w) => {
    timer.start(90, ()=>{
      store.dispatch(actions.drawOver());
      setTimeout(()=>{
        const afterStore = store.getState();
        if(afterStore.game.drawn.length === users.length && afterStore.game.currentRound < 2){
          store.dispatch(actions.roundOver());
        }else if(afterStore.game.currentRound === 2){
          store.dispatch(actions.gameOver());
        }else {
          store.dispatch(actions.newDrawer());
        }
      }, 0)
    });
    store.dispatch(actions.startDraw())
  });
  io.on('editNick', (u) => socket.emit(store.dispatch(actions.editNick(u))))
  io.on('disconnect', (u) => store.dispatch(actions.userLeft(u)));
});

store.subscribe(() => {

  const currentState = store.getState();
  // this should be merged to save transit latency on chat / drawing 
  // those might need their own sockets, etc.
  // io.emit('globalUpdates', _.omit(oa({}, currentState, {
  //   game: _.omit(currentState.game, 'chat')
  // }), ['lobbyChat']));

});