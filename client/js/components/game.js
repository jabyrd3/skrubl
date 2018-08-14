import React from 'react';
import {connect} from 'react-redux';
import Chat from './chat';
class Game extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div>
      <h2>game</h2>
      <Chat type="game" />
    </div>;
  }
}

export default connect((s, op) => {
  return {};
})(Game);
