import React from 'react';
import { hot } from 'react-hot-loader';
import {connect} from 'react-redux';
import Chat from './components/chat';
import ReactDOM from 'react-dom'
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import * as actions from './actions';
import Lobby from './components/lobby';
import Game from './components/game';
require('milligram/dist/milligram.min.css');

global.socket = io();

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
window.__REDUX_DEVTOOLS_EXTENSION__());

socket.on('populateState', s => console.log("fuck") || store.dispatch(actions.populateState(s)));
socket.on('lobbyMessage', s => console.log("lobbyMessage") || store.dispatch(actions.lobbyMessage(s)))
socket.on('gameMessage', s => console.log("gamemessage",s.payload) || store.dispatch(actions.gameMessage(s)))
socket.on('userLeft', s => console.log("userLeft",s.payload) || store.dispatch(actions.userLeft(s)))
socket.on('addUser', s => console.log("addUser", s.payload) || store.dispatch(actions.addUser(s)))
socket.on('setLeader', s => store.dispatch(actions.setLeader(s)))
socket.on('editNick', s => store.dispatch(actions.editNick(s.payload)))
socket.on('startGame', s => store.dispatch(actions.newGame(s)))
socket.on('mergeGame', s => store.dispatch(actions.mergeGame(s)))
socket.on('receiveLines', s => store.dispatch(actions.receiveLines(s)))
class App extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return this.props.lobby ?
      <Lobby /> :
      <Game />
  }
}

const ConnectedApp = connect(s => Object.assign({}, {lobby: s.lobby}))(App)
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>, document.getElementById('app'))

export default hot(module)(App);
