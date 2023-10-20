import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NextButton from './NextButton';
import ClearButton from './ClearButton';
import BackButton from './BackButton';
import TextFieldComponent from './TextFieldComponent';
import { FormattedMessage } from 'react-intl';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Step,
  StepContent,
  Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ActionsContainer, CheckboxContainer, StyledStepLabel, Wrapper} from "../../styles/styles";

class WifiStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      STA_SSID1: '',
      STA_PASS1: '',
      WIFI_IP_ADDRESS: '',
      WIFI_SUBNETMASK: '',
      WIFI_GATEWAY: '',
      WIFI_DNS: '',
      showPassword: false,
      staticIPEnabled: false,
    };
 
    if (localStorage.getItem("network") !== null) {
      this.state = JSON.parse(window.localStorage.getItem("network"));
      // do not show password per default, ever
      this.state.showPassword = false;
    }
  
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeCheckBox(event) {
    // there is only one checkbox in this step
    this.setState({
      staticIPEnabled: event.target.checked,
      WIFI_IP_ADDRESS: '',
      WIFI_SUBNETMASK: '',
      WIFI_GATEWAY: '',
      WIFI_DNS: '',
    });
  }

  handleClickShowPassword(_) {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  handleNext() {
    const { nextHandler } = this.props;
    window.localStorage.setItem("network", JSON.stringify(this.state))

    nextHandler({ network: this.state });
  }
  handleClear() {
    this.setState({
      STA_SSID1: '',
      STA_PASS1: '',
      WIFI_IP_ADDRESS: '',
      WIFI_SUBNETMASK: '',
      WIFI_GATEWAY: '',
      WIFI_DNS: '',
      showPassword: false,
      staticIPEnabled: false,
    });
    window.localStorage.removeItem("network");
  }
  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  render() {
    const { classes, backHandler, nextHandler, ...other } = this.props;

    const {
      STA_SSID1,
      STA_PASS1,
      staticIPEnabled,
      WIFI_IP_ADDRESS,
      WIFI_SUBNETMASK,
      WIFI_GATEWAY,
      WIFI_DNS,
      showPassword,
    } = this.state;

    return (
      <Step {...other}>
        <StyledStepLabel>
          <FormattedMessage id="stepWifiConfTitle" />
        </StyledStepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage id="stepWifiConfDesc" />
          </Typography>
          <form noValidate autoComplete="off">
            <ActionsContainer>
              <TextFieldComponent
                name="STA_SSID1"
                label={<FormattedMessage id="stepWifiConfSSID" />}
                classes={classes}
                value={STA_SSID1}
                onChange={this.handleChange}
              />
              <TextFieldComponent
                name="STA_PASS1"
                label={<FormattedMessage id="stepWifiConfPassword" />}
                classes={classes}
                type={showPassword ? 'text' : 'password'}
                value={STA_PASS1}
                onChange={this.handleChange}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </ActionsContainer>
            <CheckboxContainer>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={staticIPEnabled}
                    name="staticIPEnabled"
                    onChange={this.handleChangeCheckBox}
                    value="staticIPEnabled"
                  />
                }
                label={<FormattedMessage id="stepWifiConfStaticIP" />}
              />
            </CheckboxContainer>

            {staticIPEnabled && (
              <ActionsContainer>
                <TextFieldComponent
                  name="WIFI_IP_ADDRESS"
                  label={<FormattedMessage id="stepWifiConfIP" />}
                  classes={classes}
                  value={WIFI_IP_ADDRESS}
                  onChange={this.handleChange}
                />
                <TextFieldComponent
                  name="WIFI_SUBNETMASK"
                  label={<FormattedMessage id="stepWifiConfMask" />}
                  classes={classes}
                  value={WIFI_SUBNETMASK}
                  onChange={this.handleChange}
                />
                <TextFieldComponent
                  name="WIFI_GATEWAY"
                  label={<FormattedMessage id="stepWifiConfGateway" />}
                  classes={classes}
                  value={WIFI_GATEWAY}
                  onChange={this.handleChange}
                />
                <TextFieldComponent
                  name="WIFI_DNS"
                  label={<FormattedMessage id="stepWifiConfDNS" />}
                  classes={classes}
                  value={WIFI_DNS}
                  onChange={this.handleChange}
                />
              </ActionsContainer>
            )}
          </form>
          <ActionsContainer>
            <Wrapper>
              <BackButton disabled={false} onClick={this.handleBack} />
            </Wrapper>
            <Wrapper>
              <ClearButton disabled={false} onClick={this.handleClear} />
            </Wrapper>
            <Wrapper>
              <NextButton disabled={false} onClick={this.handleNext} />
            </Wrapper>
          </ActionsContainer>
        </StepContent>
      </Step>
    );
  }
}

WifiStep.propTypes = {
  nextHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default WifiStep;
