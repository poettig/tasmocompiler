import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {Checkbox, FormControlLabel, Tooltip} from "@mui/material";
import {CheckboxContainer} from "../../../styles/styles";

function FeaturesSelector(props) {
  const {
    value,
    onChange,
    item: { description, tooltip, name },
  } = props;

  return (
    <CheckboxContainer>
      <Tooltip title={tooltip ? (<FormattedMessage id={tooltip} />) : ('')}>
        <FormControlLabel
          control={(
            <Checkbox
              checked={value}
              name={name}
              onChange={onChange}
              value={name}
            />
          )}
          label={<FormattedMessage id={description} />}
        />
      </Tooltip>
    </CheckboxContainer>
  );
}

FeaturesSelector.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    description: PropTypes.string,
    tooltip: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default FeaturesSelector;
