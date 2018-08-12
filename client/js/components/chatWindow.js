import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

export class ChatWindow extends React.Component {
    render() {
        const {dispatch, type} = this.props;
        return (
          <div>put messages here</div>
        );
    }
}

export default connect((s, ownProps) => {
 	return {};
})(ChatWindow);
