import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import _ from 'lodash';

export class ChatWindow extends React.Component {
    render() {
        const {dispatch, type, messages} = this.props;
        return (
          <div className="messages">{messages
              .map(msg => <p key={msg.uuid}>{(()=>{
                const user = this.props.users.find(u=>u.id === msg.user);
                console.log('select user', user, msg.user, this.props.users)
                return user && user.nick || msg.user;
              })()} : {msg.body}</p>)}</div>
        );
    }
}

export default connect((s, ownProps) => {
 	return {
    messages: ownProps.type === 'lobby' ?
      _.uniqBy(s.lobbyChat, 'uuid') :
      _.uniqBy(s.game.chat, 'uuid'),
    users: s.users
  };
})(ChatWindow);
