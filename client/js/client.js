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

global.socket = io();

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
window.__REDUX_DEVTOOLS_EXTENSION__());

socket.on('populateState', s => console.log("fuck") || store.dispatch(actions.populateState(s)));
socket.on('lobbyMessage', s => console.log("lobbyMessage") || store.dispatch(actions.lobbyMessage(s)))
socket.on('gameMessage', s => console.log("gamemessage",s.payload) || store.dispatch(actions.gameMessage(s)))

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
