import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {CompileMessagesBox} from "../../styles/styles";

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.messageBoxElement = React.createRef();
  }

  componentDidUpdate() {
    this.messageBoxElement.current.scrollTop = this.messageBoxElement.current.scrollHeight;
  }

  render() {
    const { compileMessages } = this.props;

    return (
      <CompileMessagesBox
        name="compileMessages"
        label={<FormattedMessage id="stepVersionCompProgress" />}
        fullWidth
        multiline
        minRows={9}
        maxRows={9}
        value={compileMessages}
        variant="outlined"
        margin="normal"
        inputRef={this.messageBoxElement}
        InputProps={{
          readOnly: true,
        }}
      />
    );
  }
}

MessageBox.propTypes = {
  compileMessages: PropTypes.string.isRequired,
};

export default MessageBox;
