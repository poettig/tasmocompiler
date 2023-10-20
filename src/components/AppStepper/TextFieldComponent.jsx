import React from 'react';
import PropTypes from 'prop-types';
import {TextField} from "@mui/material";
import {StyledTextField} from "../../styles/styles";

function TextFieldComponent(props) {
  const { name, label, classes, value, type, onChange, inputProps } = props;

  return (
    <StyledTextField
      id={`${name}-id`}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      margin="normal"
      type={type}
      InputProps={inputProps}
      variant="standard"
    />
  );
}

TextFieldComponent.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  inputProps: PropTypes.oneOfType([PropTypes.object]),
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextFieldComponent.defaultProps = {
  type: 'text',
};

export default TextFieldComponent;
