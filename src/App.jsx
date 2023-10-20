import React, {Component} from 'react';
import io from 'socket.io-client';
import {IntlProvider} from 'react-intl';

import TopAppBar from './components/TopAppBar/TopAppBar';
import SourceStep from './components/AppStepper/SourceStep';
import VersionStep from './components/AppStepper/VersionStep/VersionStep';
import WifiStep from './components/AppStepper/WifiStep';
import FeaturesStep from './components/AppStepper/FeaturesStep/FeaturesStep';
import CustomParametersStep from './components/AppStepper/CustomParametersStep';
import MessageBox from './components/MessageBox/MessageBox';
import DownloadLinks from './components/DownloadLinks/DownloadLinks';
import {allMessages, defaultLanguage} from './locales/languages';
import {tasmotaGUILanguages} from './components/AppStepper/VersionStep/Variables/Languages';
import availableFeatures from './components/AppStepper/FeaturesStep/AvailableFeatures';
import {Root, StyledStepper} from "./styles/styles";
import {createTheme, ThemeProvider} from "@mui/material";

const browserLanguage = navigator.language.toLocaleLowerCase();

console.log(`Detected browser language: ${browserLanguage}`);

let tcGUILanguage = defaultLanguage;

Object.keys(allMessages).some((l) => {
  const found = allMessages[l].browserLang.includes(browserLanguage);
  if (found) {
    tcGUILanguage = l;
  }
  return found;
});

console.log(`TasmoCompiler GUI language set to ${tcGUILanguage}`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      tags: [],
      compiling: false,
      showMessageBox: false,
      showDownloadLinks: false,
      compileMessages: '',
      features: {},
      network: {},
      version: {},
      customParams: '',
      tcGUILanguage,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCompile = this.handleCompile.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  componentDidMount() {
    const socket = io();
    socket.on('message', (data) => {
      this.setState((state) => {
        let newMessages = state.compileMessages;
        newMessages = `${newMessages}${data}`;
        return {compileMessages: newMessages};
      });
    });

    socket.on('finished', (data) => {
      this.setState({compiling: false, showDownloadLinks: data.ok});
    });

    this.changeLanguage(this.state.tcGUILanguage);
  }

  handleNext = (data) => {
    this.setState((state) => ({
      activeStep: state.activeStep + 1,
      ...data,
    }));
  };

  handleBack = () => {
    this.setState((state) => ({
      activeStep: state.activeStep - 1,
      compileMessages: '',
      showMessageBox: false,
      showDownloadLinks: false,
    }));
  };

  handleCompile = (data) => {
    const uri = '/api/v1/compile';

    this.setState(
      {
        compiling: true,
        showMessageBox: true,
        compileMessages: '',
        showDownloadLinks: false,
        ...data,
      },
      () => {
        const {
          compiling,
          showMessageBox,
          message,
          activeStep,
          tags,
          compileMessages,
          ...postData
        } = this.state;

        fetch(uri, {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {'Content-Type': 'application/json'},
        })
          .then((res) => res.json())
          .then((json) => {
            if (!json.ok) {
              this.setState((state) => {
                let newMessages = state.compileMessages;
                newMessages = `${newMessages}${json.message}`;
                return {compileMessages: newMessages, compiling: false};
              });
            }
          })
          .catch((error) => {
            this.setState({compileMessages: error.message, compiling: false});
          });
      }
    );
  };

  changeLanguage = (lang) => {
    tasmotaGUILanguages.sort((a, b) => {
      return allMessages[lang]['source'][a.name].localeCompare(
        allMessages[lang]['source'][b.name]
      );
    });
    availableFeatures.sort((a, b) => {
      return allMessages[lang]['source'][a.description].localeCompare(
        allMessages[lang]['source'][b.description]
      );
    });
    this.setState({tcGUILanguage: lang});
  };

  render() {
    const {
      activeStep,
      tags,
      compiling,
      showMessageBox,
      showDownloadLinks,
      compileMessages,
      tcGUILanguage,
      ...other
    } = this.state;

    const bnHandlersProps = {
      backHandler: this.handleBack,
      nextHandler: this.handleNext,
    };

    const theme = createTheme({
      palette: {
        primary: {
          main: "#3f51b5"
        }
      }
    });

    return (
      <ThemeProvider theme={theme}>
        <IntlProvider
          locale={tcGUILanguage}
          messages={allMessages[tcGUILanguage]['source']}
        >
          <Root>
            <TopAppBar
              {...this.props}
              locale={tcGUILanguage}
              changeLanguage={this.changeLanguage}
            />
            <StyledStepper activeStep={activeStep} orientation="vertical">
              <SourceStep {...this.props} nextHandler={this.handleNext} key={1}/>
              <WifiStep {...this.props} {...bnHandlersProps} key={2}/>
              <FeaturesStep {...this.props} {...bnHandlersProps} key={3}/>
              <CustomParametersStep
                {...this.props}
                {...bnHandlersProps}
                pstate={other}
                key={4}
              />
              <VersionStep
                {...this.props}
                repoTags={tags}
                backHandler={this.handleBack}
                compileHandler={this.handleCompile}
                compiling={compiling}
                key={5}
              />
            </StyledStepper>
            {showMessageBox && (
              <MessageBox {...this.props} compileMessages={compileMessages}/>
            )}
            {showDownloadLinks && (
              <DownloadLinks {...this.props} features={other.features}/>
            )}
          </Root>
        </IntlProvider>
      </ThemeProvider>
    );
  }
}

export default App;