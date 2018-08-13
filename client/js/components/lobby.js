import React from 'react';
import {connect} from 'react-redux';
import Chat from './chat';
class Lobby extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div>
      YOU: {this.props.me}<br/>
      leader: {this.props.leader}<br/><br/>
      {this.props.users.map(u=><p>{u}</p>)}
      <Chat type="lobby" />
    </div>;
  }
}

export default connect((s, op) => {
  return {
    users: s.users,
    me: s.you,
    leader: s.leader
  };
})(Lobby);
