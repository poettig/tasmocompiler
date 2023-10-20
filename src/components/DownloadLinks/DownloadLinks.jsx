import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {DonationImage, DonationLinks, DownloadButton, IconRight, Link, LinkTypography} from "../../styles/styles";

function Typography(props) {
  return null;
}

Typography.propTypes = {
  variant: PropTypes.string,
  className: PropTypes.any,
  children: PropTypes.node
};

class DownloadLinks extends Component {
  constructor(props) {
    super(props);
    this.downloadLinksElement = React.createRef();
  }

  componentDidMount() {
    // this.downloadLinksElement.current.scrollIntoView({
    //   block: 'end',
    //   inline: 'nearest',
    //   behavior: 'smooth'
    // });
    this.downloadLinksElement.current.scrollIntoView(false);
  }

  render() {
    const { features } = this.props;
    const isEsp8266 = features.board.chip_type === 'esp8266';
    const isEsp32 = features.board.chip_type === 'esp32';
    const envPath = features.board.platformio_env_name;

    return (
      <div ref={this.downloadLinksElement}>
        <DonationLinks>
          <Typography>If TasmoCompiler is useful to You, please consider supporting the project:</Typography>
          <a href='https://ko-fi.com/benzino77' target='_blank' rel='noopener noreferrer'>
            <DonationImage src='img/kofi.svg' alt='ko-fi' />
          </a>
          <a href='https://github.com/sponsors/benzino77' target='_blank' rel='noopener noreferrer'>
            <DonationImage src='img/github.svg' alt='github sponsor' />
          </a>
          <a href='https://paypal.me/tasmocompiler' target='_blank' rel='noopener noreferrer'>
            <DonationImage src='img/paypal.svg' alt='paypal' />
          </a>
        </DonationLinks>

        <LinkTypography variant='caption'>
          <FormattedMessage id='stepDownload' />
        </LinkTypography>
        <Link>
          <DownloadButton
            variant='contained'
            color='primary'
            href={`/download/${envPath}.bin`}
          >
            firmware.bin
            <IconRight />
          </DownloadButton>
          {isEsp8266 && (
            <DownloadButton
              variant='contained'
              color='primary'
              href={`/download/${envPath}.bin.gz`}
            >
              firmware.bin.gz
              <IconRight />
            </DownloadButton>
          )}
          {isEsp32 && (
            <DownloadButton
              variant='contained'
              color='primary'
              href={`/download/${envPath}.factory.bin`}
            >
              firmware.factory.bin
              <IconRight />
            </DownloadButton>
          )}
          <DownloadButton
            variant='contained'
            color='primary'
            href='/download/platformio_override.ini'
          >
            platformio_override.ini
            <IconRight />
          </DownloadButton>
          <DownloadButton
            variant='contained'
            color='primary'
            href='/download/user_config_override.h'
          >
            user_config_override.h
            <IconRight />
          </DownloadButton>
        </Link>
      </div>
    );
  }
}

DownloadLinks.propTypes = {
  features: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default DownloadLinks;
