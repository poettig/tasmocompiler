import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { allMessages } from '../../locales/languages';
import {AppBar, MenuItem, Tooltip, Typography} from "@mui/material";
import {
  LanguagesList,
  LanguagesContainer,
  LanguagesIcon,
  ProjectPageContainer,
  ProjectPageImage,
  SelectedLanguage,
  StyledToolbar, FlagIcon, ToolbarRight, Root, IconLeft
} from "../../styles/styles";

class TopAppBar extends Component {
  constructor(props) {
    super(props);
    this.state = { version: '', anchorEl: null };
  }

  componentDidMount() {
    fetch('/api/v1/tcversion')
      .then((res) => res.json())
      .then((ret) => {
        this.setState({ version: `v${ret.version}` });
      })
      .catch((_) => {
        this.setState({ version: '' });
      });
  }

  handleOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (lang, locale) => {
    if (lang && lang !== locale) {
      const { changeLanguage } = this.props;
      changeLanguage(lang);
    }
    this.setState({ anchorEl: null });
  };

  render() {
    const { locale, changeLanguage, ...other } = this.props;
    const { version, anchorEl } = this.state;

    return (
      <Root>
        <AppBar {...other} position='static' color='primary'>
          <StyledToolbar>
            <Typography variant='h6' color='inherit'>
              TasmoCompiler {version}
            </Typography>

            <ToolbarRight>
              <Tooltip title={<FormattedMessage id='headerProjectGithubPageTooltip' />}>
                <ProjectPageContainer>
                  <a href='https://github.com/benzino77/tasmocompiler' target='_blank' rel='noopener noreferrer'>
                    <ProjectPageImage />
                  </a>
                </ProjectPageContainer>
              </Tooltip>
              <LanguagesContainer
                role='button'
                tabIndex={0}
                aria-controls='langs-menu'
                aria-haspopup='true'
                onClick={this.handleOpen}
                onKeyPress={this.handleOpen}
              >
                <SelectedLanguage color='inherit'>
                  {allMessages[locale].nativeName}
                  <LanguagesIcon />
                </SelectedLanguage>
              </LanguagesContainer>
            </ToolbarRight>
            <LanguagesList
              id='langs-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => this.handleClose()}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {Object.keys(allMessages)
                .sort()
                .map((lang) => {
                  return (
                    <MenuItem onClick={() => this.handleClose(lang, locale)} key={lang} selected={locale === lang}>
                      <FlagIcon src={allMessages[lang].flag} alt='' />
                      <IconLeft>{allMessages[lang].nativeName}</IconLeft>
                    </MenuItem>
                  );
                })}
            </LanguagesList>
          </StyledToolbar>
        </AppBar>
      </Root>
    );
  }
}

TopAppBar.propTypes = {
  locale: PropTypes.string.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default TopAppBar;
