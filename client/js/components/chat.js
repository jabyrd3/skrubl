import React from 'react';
import PropTypes from 'prop-types';
import ChatWindow from './chatWindow';
const type="lobby";
export default class chat extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  render() {

    return (
        <div>
          <ChatWindow
            type="lobby" />
            <form onSubmit={e => {
              console.log('submit firing', this.state.message);
              e.preventDefault();
              socket.emit(`${type}Message`, {body: this.state.message})
              this.setState({message: ''});
            }}>
              <input
                onChange={e => {
                  this.setState({message: e.currentTarget.value})
                }}              
                type="text"
                value={this.state.message}
                placeholder="Message"></input>
              <button role="submit">Post</button>
            </form>
        </div>
    );
  }
}
