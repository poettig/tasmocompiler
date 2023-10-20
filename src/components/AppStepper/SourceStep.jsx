import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import NextButton from './NextButton';
import {Button, Step, StepContent} from "@mui/material";
import {ActionsContainer, ProgressIndicator, StyledStepLabel, Wrapper} from "../../styles/styles";

function Typography(props) { return null;
}

Typography.propTypes = {children: PropTypes.node};

function CircularProgress(props) {
  return null;
}

CircularProgress.propTypes = {
  size: PropTypes.number,
  className: PropTypes.shape({
    color: PropTypes.string,
    top: PropTypes.string,
    left: PropTypes.string,
    position: PropTypes.string,
    marginTop: PropTypes.number,
    marginLeft: PropTypes.number
  })
};

class SourceStep extends Component {
  constructor(props) {
    super(props);

    this.tags = [];
    this.state = {
      isRepo: false,
      message: '',
      cloning: false,
      gettingTags: false,
    };

    this.handleClonePull = this.handleClonePull.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    fetch('/api/v1/repoavailability')
      .then((res) => res.json())
      .then((ret) => {
        this.setState({ isRepo: ret.result, message: '' });
      })
      .catch((error) => {
        this.setState({ isRepo: false, message: error.message });
      });
  }

  handleClonePull() {
    const { isRepo } = this.state;
    const uri = isRepo ? '/api/v1/pullrepo' : '/api/v1/clonerepo';

    this.setState({ cloning: true });
    fetch(uri)
      .then((res) => res.json())
      .then((ret) => {
        if (!ret.ok) throw new Error(ret.message);
        this.tags = ret.tags;
        this.setState({ isRepo: true, cloning: false });
      })
      .catch((error) => {
        this.setState({ message: error.message, cloning: false });
      });
  }

  handleNext() {
    const { nextHandler } = this.props;

    if (this.tags.length === 0) {
      this.setState({ gettingTags: true });
      fetch('/api/v1/repotags')
        .then((res) => res.json())
        .then((ret) => {
          this.tags = ret.tags;
          this.setState({ gettingTags: false });
          nextHandler({ tags: this.tags });
        })
        .catch((error) => {
          this.setState({ message: error.message, gettingTags: false });
        });
    } else {
      nextHandler({ tags: this.tags });
    }
  }

  render() {
    const { classes, nextHandler, ...other } = this.props;

    const { isRepo, message, cloning, gettingTags } = this.state;

    return (
      <Step {...other}>
        <StyledStepLabel error={message.length > 0 && other.active}>
          <FormattedMessage id="stepSourceTitle" />
        </StyledStepLabel>
        <StepContent>
          {isRepo ? (
            <Typography>
              <FormattedMessage id="stepSourceDescRefresh" />
            </Typography>
          ) : (
            <Typography>
              <FormattedMessage id="stepSourceDescDownload" />
            </Typography>
          )}
          <ActionsContainer>
            <Wrapper>
              <Button
                disabled={cloning || gettingTags}
                variant="contained"
                color="primary"
                onClick={this.handleClonePull}
              >
                {isRepo ? (
                  <FormattedMessage id="btnRefreshSrc" />
                ) : (
                  <FormattedMessage id="btnDownloadSrc" />
                )}
              </Button>
              {cloning && (
                <ProgressIndicator
                  size={24}
                />
              )}
            </Wrapper>
            <Wrapper>
              <NextButton
                disabled={!isRepo || cloning || gettingTags}
                onClick={this.handleNext}
              />
              {gettingTags && (
                <ProgressIndicator
                  size={24}
                />
              )}
            </Wrapper>
          </ActionsContainer>
          {message && (
            <Typography color="error" variant="subtitle1">
              Error:
              {message}
            </Typography>
          )}
        </StepContent>
      </Step>
    );
  }
}

SourceStep.propTypes = {
  nextHandler: PropTypes.func.isRequired,
};

export default SourceStep;
