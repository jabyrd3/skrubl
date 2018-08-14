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
const index = require('../client');
server.listen(3000, '127.0.0.1');
const {logger} = require('redux-logger');

const fs = require('fs');
// Returns the path to the word list which is separated by `\n`
const wordListPath = require('word-list');
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');

// util, split this out
const randomUser = (users) => 
  users[Math.floor(Math.random() * users.length) + 0].id;
const randomWords = (count) =>
  Array.from({length: count}).map(() =>
    wordArray[Math.floor(Math.random() * wordArray.length) + 0]);

// serve client
app.get('/', (req, res) => {
  res.send(index());
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
    // // array of ids representing users who guessed correct
    // guesses: [],
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

// spawn store, bit ugly
const store = redux.createStore(act.createReducer({
  [actions.lobbyMessage]: (s, p) => 
    oa({}, s, {
      lobbyChat: s.lobbyChat.concat([p])
    }),
  [actions.gameMessage]: (s, p) => 
    // test if message includes correct word, if so, add user to game.currentCorrect
    oa({}, s, {
      game: oa({}, s.game, {
        chat: s.game.chat.concat(p),
        currentCorrect: p.body.indexOf(s.game.currentWord) > -1 ?
          s.game.currentCorrect.concat([p.user]) :
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
          {
            id: u.id,
            nick: p.nick
          })
    }), 
  [actions.userLeft]: (s, p) =>
    oa({}, s, {
      users: s.users.filter(u => p !== u.id),
      game: !s.lobby ?
        s.game.drawer === p ?
          oa({}, s.game, {
            drawer: randomUser(s.users.filter(u=>p!==u.id))
          }) : s.game : s.game
    }),
  [actions.newGame]: (s, p) =>
    oa({}, s, {lobby: false}, {
      game: oa({}, freshGame.game, {
        drawer: randomUser(s.users),
        wordOpts: randomWords(5)
      })
    }),
  [actions.gameOver]: (s, p) =>
    oa({}, s, {lobby: true}, {
      ...freshGame
    }),
  [actions.startDraw]: (s, p) =>
    // timer is goooo
    oa({}, s, {
      game: oa({}, s.game, {
        wordPicked: true,
        currentWord: p
      })
    }),
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
  [actions.setLeader]: (s, p) => 
    oa({}, s, {
      leader: p
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
  lobby: true,
  leader: false
}), redux.applyMiddleware(logger));

io.on('connection', (s) => {
  io.emit('addUser', store.dispatch(actions.addUser({
    id:s.id,
    nick: false
  })))
  // overwrite client state with in progress details
  if(store.getState().leader === false){
    store.dispatch(actions.setLeader(s.id));
  }
  s.emit('populateState', {
      ...oa({},
        store.getState(),
        // redact word so no cheaters!
        {game: oa({}, store.getState().game, {
            currentWord: 'redact!',
            wordOpts: []
          })}),
      you: {
        id: s.id,
        nick: false
      }});
  s.on('lobbyMessage', m => io.emit('lobbyMessage', store.dispatch(actions.lobbyMessage({
    ...m,
    user: s.id
  }))));
  s.on('gameMessage', m => io.emit('gameMessage', store.dispatch(actions.gameMessage({
    ...m,
    user: s.id}
    ))));
  s.on('startGame', () => {
    store.dispatch(actions.newGame());
    setTimeout(() => {
      const state = store.getState();
      io.emit('startGame', _.omit(state.game, 'wordOpts'));
      io.to(state.game.drawer).emit('mergeGame', {
        wordOpts: state.game.wordOpts
      });
    }, 0);
  });
  s.on('pickWord', (w) => {
    // timer.start(90, ()=>{
    //   store.dispatch(actions.drawOver());
    //   setTimeout(()=>{
    //     const afterStore = store.getState();
    //     if(afterStore.game.drawn.length === users.length && afterStore.game.currentRound < 2){
    //       store.dispatch(actions.roundOver());
    //     }else if(afterStore.game.currentRound === 2){
    //       store.dispatch(actions.gameOver());
    //     }else {
    //       store.dispatch(actions.newDrawer());
    //     }
    //   }, 0)
    // });
    store.dispatch(actions.startDraw(w))
    setTimeout(() =>{
      s.emit('mergeGame', {
        wordPicked: true,
        wordOpts: []
      });
      io.emit('mergeGame', {
        wordPicked: true
      });
    }, 0)
  });
  s.on('editNick', (u) => io.emit('editNick', store.dispatch(actions.editNick({id:s.id, nick: u}))))
  s.on('disconnect', (u) => {
    store.dispatch(actions.userLeft(s.id));
    setTimeout(() => io.emit('userLeft', store.getState().users), 0)
    setTimeout(() => {
      const state = store.getState()
      if (s.id === state.leader){
        if (state.users.length > 0){
          store.dispatch(actions.setLeader(randomUser(state.users)));
          setTimeout(()=>io.emit('setLeader', store.getState().leader), 0);
        } else {
          store.dispatch(actions.setLeader(false));
        }
      }
      }, 0);
  });
});
