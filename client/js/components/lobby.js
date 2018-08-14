import React from 'react';
import {connect} from 'react-redux';
import Chat from './chat';
class Lobby extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      nick: ''
    };
  }
  render(){
    const {me, leader} = this.props;
    return <div>
      <h2>lobby</h2>
      YOU: {this.props.me.nick || this.props.me.id}<br/>
      leader: {this.props.leader}<br/><br/>
      {this.props.users.map(u=><p>{u.nick || u.id}</p>)}
      {me.nick ?
        <p>{me.nick}</p>:
        <div>
          <input
            type="text"
            placeholder="pick a nick basket"
            onChange={e => this.setState({nick: e.currentTarget.value})} />
          <button onClick={()=>{
            socket.emit('editNick', this.state.nick);
          }}>Pick the nick</button>
          {me.id === leader &&
            <button
              onClick={() => socket.emit('startGame')}>Start the game</button>}
        </div>}
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
