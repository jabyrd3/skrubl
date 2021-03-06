import React from 'react';
import PropTypes from 'prop-types';
import ChatWindow from './chatWindow';
import uuid from 'uuid/v4';

export default class Chat extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  render() {
    const {type} = this.props;
    return (
        <div className={this.props.className}>
          <ChatWindow
            type={type} />
            <form onSubmit={e => {
              e.preventDefault();
              socket.emit(`${type}Message`, {
                body: this.state.message,
                uuid: uuid()
              })
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
