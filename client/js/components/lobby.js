import React from 'react';
import {connect} from 'react-redux';
import Chat from './chat';
class Lobby extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div>
      <Chat type="lobby" />
    </div>;
  }
}

export default connect((s, op) => {
  return {};
})(Lobby);
