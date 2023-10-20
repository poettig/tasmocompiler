import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BackButton from '../BackButton';
import CompileButton from '../CompileButton';
import VersionSelector from './VersionSelector';
import { tasmotaGUILanguages, preselectedTasmotaGUILanguage } from './Variables/Languages';
import {Step, StepContent, Typography} from "@mui/material";
import {ActionsContainer, ActionsForm, ProgressIndicator, StyledStepLabel, Wrapper} from "../../../styles/styles";

class VersionStep extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasmotaVersion: 'development',
      MY_LANGUAGE: preselectedTasmotaGUILanguage,
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCompile = this.handleCompile.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCompile() {
    const { compileHandler } = this.props;
    compileHandler({ version: this.state });
  }

  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  componentDidUpdate(prevProps, prevState) {
    const { repoTags } = this.props;
    if (repoTags.length !== prevProps.repoTags.length) {
      this.setState({
        tasmotaVersion: repoTags[repoTags.length - 1],
      });
    }
  }

  render() {
    const { message, tasmotaVersion, MY_LANGUAGE } = this.state;

    const { classes, backHandler, repoTags, compiling, compileHandler, ...other } = this.props;

    return (
      <Step {...other}>
        <StyledStepLabel error={message.length > 0 && other.active}>
          <FormattedMessage id='stepVersionTitle' />
        </StyledStepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage id='stepVersionDesc' />
          </Typography>
          <ActionsForm autoComplete='off'>
            <VersionSelector
              items={repoTags}
              name='tasmotaVersion'
              value={tasmotaVersion}
              label={<FormattedMessage id='stepVersionTasmota' />}
              onChange={this.handleChange}
              classes={classes}
            />
            <VersionSelector
              items={tasmotaGUILanguages}
              name='MY_LANGUAGE'
              value={MY_LANGUAGE}
              label={<FormattedMessage id='stepVersionLanguage' />}
              onChange={this.handleChange}
              classes={classes}
              preselectedTasmotaGUILanguage={preselectedTasmotaGUILanguage}
            />
          </ActionsForm>
          <ActionsContainer>
            <Wrapper>
              <BackButton disabled={compiling} onClick={this.handleBack} />
            </Wrapper>
            <Wrapper>
              <CompileButton disabled={compiling} onClick={this.handleCompile} />
              {compiling && <ProgressIndicator size={24} />}
            </Wrapper>
          </ActionsContainer>
          {message && (
            <Typography color='error' variant='subtitle1'>
              Error:
              {message}
            </Typography>
          )}
        </StepContent>
      </Step>
    );
  }
}

VersionStep.propTypes = {
  repoTags: PropTypes.oneOfType([PropTypes.array]).isRequired,
  compiling: PropTypes.bool.isRequired,
  compileHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default VersionStep;
