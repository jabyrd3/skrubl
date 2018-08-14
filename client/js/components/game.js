import React from 'react';
import {connect} from 'react-redux';
import Chat from './chat';
class Game extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    const {me, drawer, game, users} = this.props;
    console.log(this.props)
    return !me || !game ? <h2>fetching state...</h2> : <div>
      <h2>game</h2>
      {me.id !== drawer && !game.wordPicked && <div>
        <h2>{(()=>{
          const user = users.find(u=>u.id === drawer);
          return user && (user.nick || user.id) || 'null';
        })()} is picking a word</h2>
        </div>}
      {me.id === drawer && game.wordPicked &&
        <div>
          <h2>Draw below!</h2>
        </div>}
      {me.id === drawer &&
        !game.wordPicked &&
        <div className="modal">
          <h2>Pick A Word!</h2>
          {game.wordOpts &&
            game.wordOpts.map(opt =>
              <p onClick={()=>socket.emit('pickWord', opt)}>{opt}</p>)}
        </div>}
      <Chat type="game" />
    </div>;
  }
}

export default connect((s, op) => {
  console.log('jab', s.you)
  return {
    me: s.you,
    drawer: s.game.drawer,
    game: s.game,
    users: s.users
  };
})(Game);
