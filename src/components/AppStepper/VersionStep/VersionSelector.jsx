import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {InputLabel, MenuItem, Select} from "@mui/material";
import {
  FlagIcon,
  LanguageFormControl,
  IconRight,
  TasmotaConfigSelector,
  VersionFormControl
} from "../../../styles/styles";

function VersionSelector(props) {
  const {
    name,
    label,
    value,
    onChange,
    items,
    preselectedTasmotaGUILanguage,
  } = props;

  const inProps = {
    name,
    id: `${name}-id`,
  };

  const content = (
    <>
      <InputLabel htmlFor={inProps.id}>{label}</InputLabel>
      <Select value={value} onChange={onChange} inputProps={inProps} variant="standard">
        {items.map((item) => (
          <MenuItem key={item.name || item} value={item.value || item}>
            {name !== 'MY_LANGUAGE' &&
              (item === 'development' ? (
                <FormattedMessage id="stepVersionDevelopment"/>
              ) : (
                item
              ))}
            {name === 'MY_LANGUAGE' && (
              <TasmotaConfigSelector>
                <FlagIcon src={item.flag} alt=""/>
                <IconRight>
                  <FormattedMessage id={item.name}>
                    {(text) => {
                      const suffix =
                        preselectedTasmotaGUILanguage !== item.value
                          ? ` / ${item.nativeName}`
                          : '';
                      return `${text}${suffix}`;
                    }}
                  </FormattedMessage>
                </IconRight>
              </TasmotaConfigSelector>
            )}
          </MenuItem>
        ))}
      </Select>
    </>
  );

  return (
    <>
      {name === "MY_LANGUAGE" ?
        <LanguageFormControl>{content}</LanguageFormControl> :
        <VersionFormControl>{content}</VersionFormControl>}
    </>
  );
}

VersionSelector.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  items: PropTypes.oneOfType([PropTypes.array]).isRequired,
  onChange: PropTypes.func.isRequired,
  preselectedTasmotaGUILanguage: PropTypes.string,
};

export default VersionSelector;
