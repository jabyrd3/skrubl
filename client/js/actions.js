import {createAction} from 'redux-act';

export const lobbyMessage = createAction('lobby message added');
export const gameMessage = createAction('game message added');
export const addUser = createAction('added user to system');
export const userLeft = createAction('user disconnected');
export const newGame = createAction('game started');
export const gameOver = createAction('game ended');
export const populateState = createAction('populate state on initial connection');
export const setLeader = createAction('new leader chosen by server');
export const editNick = createAction('nick updated');
export const mergeGame = createAction('merge game data');
export const receiveLines = createAction('received lines');
