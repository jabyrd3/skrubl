import React from 'react';
import { hot } from 'react-hot-loader';
import Chat from './components/chat';
import ReactDOM from 'react-dom'
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducer';
import * as actions from './actions';

global.socket = io();

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
window.__REDUX_DEVTOOLS_EXTENSION__());

socket.on('populateState', s => console.log("fuck") || store.dispatch(actions.populateState(s)));
socket.on('lobbyMessage', s => store.dispatch(actions.lobbyMessage(s)))
const App = () => <div>
	<Chat />
</div>;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'))

export default hot(module)(App);
