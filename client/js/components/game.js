import React from 'react';
import {connect} from 'react-redux';
import CanvasDraw from 'react-canvas-draw';
import Chat from './chat';
import _ from 'lodash';
class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      lines: [],
      index: 0
    };
    this.throttled = _.throttle(this.updateDrawing.bind(this), 200);
  }
  componentWillReceiveProps(np){
    if(np.game.lines !== this.props.game.lines){
      this.setState({
        lines: this.state.lines.concat(np.game.lines)
      });
      setTimeout(() => {
        this.state.lines.map(line=>this.canvy.drawLine(line));
        this.setState({lines: []})
      }, 0);
    }
  }
  updateDrawing(){
    socket.emit('updateDrawing', this.state.lines);
    this.setState({index: this.state.lines.length});
    this.setState({lines: []});
  }
  render(){
    const {me, drawer, game, users} = this.props;
    const foundDrawer = users.find(u=>u.id === drawer);
    return !me || !game ? <h2>fetching state...</h2> : <div>
      <h2>game</h2>
      {me.id !== drawer && !game.wordPicked && <div>
        <h2>{foundDrawer ? foundDrawer.nick ? foundDrawer.nick : foundDrawer.id : 'null'} is picking a word</h2>
        </div>}
      <div className="container">
      <div className="row">
      {me.id !== drawer && game.wordPicked &&
        <div className="column column-75">
          <h2>{foundDrawer ? foundDrawer.nick ? foundDrawer.nick : foundDrawer.id : 'null'} is drawing</h2>
          <CanvasDraw 
            disabled={true}
            ref={canvy=>this.canvy=canvy}/>
        </div>}
      {me.id === drawer && game.wordPicked &&
        <div className="column column-75">
          <h2>Draw below!</h2>
          <CanvasDraw 
            ref={canvy=>this.canvy=canvy}
            onChange={e => {
              this.setState({lines: e.slice(this.state.index, e.length)})
              this.throttled();
            }}/>
        </div>}
      {me.id === drawer &&
        !game.wordPicked &&
        <div className="modal">
          <h2>Pick A Word!</h2>
          {game.wordOpts &&
            game.wordOpts.map(opt =>
              <p onClick={()=>socket.emit('pickWord', opt)}>{opt}</p>)}
        </div>}
      <Chat className="column column-25" type="game" />
      </div>
      </div>
    </div>;
  }
}

export default connect((s, op) => {
  return {
    me: s.you,
    drawer: s.game.drawer,
    game: s.game,
    users: s.users,
    lines: s.game.lines
  };
})(Game);
