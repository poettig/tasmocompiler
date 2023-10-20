import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NextButton from './NextButton';
import BackButton from './BackButton';
import { FormattedMessage } from 'react-intl';
import {Step, StepContent, Typography} from "@mui/material";
import {ActionsContainer, MultiTextField, StyledStepLabel, Wrapper} from "../../styles/styles";

class CustomParametersStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customParams: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { pstate } = this.props;

    const ncp = Object.keys(pstate.features)
      .filter((name) => name.startsWith('precustom#'))
      .reduce((acc, cval) => `${acc}\n${pstate.features[cval]}`, '');

    const pcp = Object.keys(prevProps.pstate.features)
      .filter((name) => name.startsWith('precustom#'))
      .reduce((acc, cval) => `${acc}\n${prevProps.pstate.features[cval]}`, '');

    if (ncp !== pcp) {
      this.setState({ customParams: ncp.trim() });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleNext() {
    const { nextHandler } = this.props;
    nextHandler({ ...this.state });
  }

  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  render() {
    const { classes, nextHandler, backHandler, ...other } = this.props;
    const { customParams } = this.state;
    const placeholder =
      '#ifdef USE_MCP230xx\n #undef USE_MCP230xx\n#endif\n#define USE_MCP230xx\n\n' +
      '#ifdef USE_MCP230xx_ADDR\n #undef USE_MCP230xx_ADDR\n#endif\n#define USE_MCP230xx_ADDR 0x20\n';

    return (
      <Step {...other}>
        <StyledStepLabel>
          <FormattedMessage id="stepCustomParamsTitle" />
        </StyledStepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage
              values={{ filename: <em>user_config_override.h</em> }}
              id="stepCustomParamsDesc"
            />
          </Typography>
          <form noValidate autoComplete="off">
            <ActionsContainer>
              <MultiTextField
                placeholder={placeholder}
                name="customParams"
                label={<FormattedMessage id="stepCustomParamsTitle" />}
                fullWidth
                multiline
                minRows={9}
                maxRows={9}
                value={customParams}
                onChange={this.handleChange}
                margin="normal"
                variant="standard"
              />
            </ActionsContainer>
          </form>
          <ActionsContainer>
            <Wrapper>
              <BackButton disabled={false} onClick={this.handleBack} />
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

CustomParametersStep.propTypes = {
  pstate: PropTypes.oneOfType([PropTypes.object]).isRequired,
  nextHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default CustomParametersStep;
