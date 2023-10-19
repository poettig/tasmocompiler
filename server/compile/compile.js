const shell = require('shelljs');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('compile');

const { switchToBranch } = require('../git/git');
const {
  tasmotaRepo,
  userConfigOvewrite,
  tasmotaVersionFile,
  userPlatformioOverrideIni,
  tasmotaInoFile,
} = require('../config/config');

const getTasmotaVersion = () => {
  const fileExists = fs.pathExistsSync(tasmotaVersionFile);
  const versRegexp = /const uint32_t VERSION = (.*);/gm;

  if (fileExists) {
    const file = fs.readFileSync(tasmotaVersionFile, {
      encoding: 'utf8',
      flag: 'r',
    });
    const match = [...file.matchAll(versRegexp)];
    if (match[0]) {
      return parseInt(match[0][1]);
    } else {
      throw new Error(`Cannot find Tasmota version in ${tasmotaVersionFile}.`);
    }
  } else {
    throw new Error(`${tasmotaVersionFile} does not exists.`);
  }
};

const getImageName = (socket, name) => {
  const fileExists = fs.pathExistsSync(tasmotaInoFile);
  const imageNameRegexp = /char image_name\[(.*)\];/gm;
  const codeImageStr = `TasmoCompiler-${name}`;
  let retValue = '';
  let messageToEmit = `${tasmotaInoFile} does not exists. The CODE_IMG_STR will not be set.\n`;

  if (fileExists) {
    const file = fs.readFileSync(tasmotaInoFile, {
      encoding: 'utf8',
      flag: 'r',
    });

    const match = [...file.matchAll(imageNameRegexp)];
    messageToEmit = `Cannot find image_name length in ${tasmotaInoFile}.\n`;

    if (match[0]) {
      // take care of space for null termination
      const maxLength = parseInt(match[0][1]) - 1;
      messageToEmit = `codeImageStr(${codeImageStr}[${codeImageStr.length}]) length exceeded image_name[${maxLength}] limit.\n`;

      if (codeImageStr.length <= maxLength) {
        retValue = `#ifdef CODE_IMAGE_STR\n  #undef CODE_IMAGE_STR\n#endif\n#define CODE_IMAGE_STR "${codeImageStr}"\n\n`;
        messageToEmit = '';
      }
    } // findImageName
  } // fileExists

  socket.emit('message', messageToEmit);
  return retValue;
};

const createUserDefines = (data) => {
  let userDefines = [];
  Object.keys(data).forEach((e) => {
    // only uppercase keys are those which are important to place in user_config_overwrite.h
    // lowercase keys are 'helpers'
    const f = e[0].toLowerCase();
    if (f !== e[0]) {
      if (data[e] === true) {
        userDefines.push(`#ifdef ${e}\n  #undef ${e}\n#endif\n#define ${e}\n\n`);
        return;
      }
      if (data[e] === false) {
        userDefines.push(`#ifdef ${e}\n  #undef ${e}\n#endif\n\n`);
        return;
      }
      if (data[e] !== '') {
        if (['STA_PASS1', 'STA_SSID1', 'WIFI_DNS', 'WIFI_GATEWAY', 'WIFI_IP_ADDRESS', 'WIFI_SUBNETMASK'].includes(e)) {
          userDefines.push(`#ifdef ${e}\n  #undef ${e}\n#endif\n#define ${e}\t"${data[e]}"\n\n`);
        } else {
          userDefines.push(`#ifdef ${e}\n  #undef ${e}\n#endif\n#define ${e}\t${data[e]}\n\n`);
        }
      }
    }
  });

  return userDefines;
};

const getFeaturePlatformioEntries = (data) => {
  let platformioEntries = {};

  Object.keys(data).forEach((e) => {
    if (e.includes('platformio_entries#')) {
      if (data[e].build_flags) {
        platformioEntries.build_flags = platformioEntries.build_flags
          ? `${platformioEntries.build_flags} ${data[e].build_flags}`
          : `${data[e].build_flags}`;
      }
      if (data[e].lib_extra_dirs) {
        // lib_extra_dirs is an array
        platformioEntries.lib_extra_dirs = platformioEntries.lib_extra_dirs
          ? platformioEntries.lib_extra_dirs.concat(data[e].lib_extra_dirs)
          : data[e].lib_extra_dirs;
      }
    }
  });

  return platformioEntries;
};

const prepareFiles = async (socket, data) => {
  const { network, features, version, customParams } = data;
  await switchToBranch(data.version.tasmotaVersion);

  // user_config_override.h file
  const userDefinesNetwork = createUserDefines(network);
  const userDefinesFeatures = createUserDefines(features);
  const userDefinesBoard = createUserDefines(features.board.defines);
  const userDefinesVersion = createUserDefines(version);
  const outputOverwrites =
    '#ifndef _USER_CONFIG_OVERRIDE_H_\n' +
    '#define _USER_CONFIG_OVERRIDE_H_\n\n' +
    `${getImageName(socket, features.board.name)}` +
    `${userDefinesNetwork.join('')}` +
    `${userDefinesFeatures.join('')}` +
    `${userDefinesBoard.join('')}` +
    `${userDefinesVersion.join('')}` +
    `${customParams}\n` +
    '#endif\n';

  try {
    await fs.writeFile(userConfigOvewrite, outputOverwrites);
    debug(`Successfully write ${userConfigOvewrite}`);
  } catch (e) {
    throw new Error(`Cannot write to ${userConfigOvewrite}: ${e}`);
  }

  // platformio.ini file
  const featurePlatformioEntries = getFeaturePlatformioEntries(features);

  const commonBuildFlags = features.board.name.includes('esp32')
    ? // eslint-disable-next-line
      '${env:tasmota32_base.build_flags}'
    : // eslint-disable-next-line
      '${common.build_flags}';

  const { platformio_entries } = features.board;

  Object.keys(featurePlatformioEntries).forEach((e) => {
    if (platformio_entries[e]) {
      if (Array.isArray(platformio_entries[e])) {
        // remove duplicates with Set
        platformio_entries[e] = [...new Set(platformio_entries[e].concat(featurePlatformioEntries[e]))];
      } else {
        platformio_entries[e] = `${platformio_entries[e]} ${featurePlatformioEntries[e]}`;
      }
    } else {
      platformio_entries[e] = featurePlatformioEntries[e];
    }

    if (e === 'build_flags' && !platformio_entries[e].includes(commonBuildFlags)) {
      platformio_entries[e] = `${commonBuildFlags} ${platformio_entries[e]}`;
    }
  });

  const platformioEnvCustom = Object.keys(platformio_entries)
    .map(
      (e) =>
        `${e} = ${Array.isArray(platformio_entries[e]) ? platformio_entries[e].join('\n\t') : platformio_entries[e]}`
    )
    .join('\n');

  const platformioContent =
    '[platformio]\n' +
    `default_envs = ${features.board.platformio_env_name}\n\n` +
    `[env:${features.board.platformio_env_name}]\n` +
    `${platformioEnvCustom}\n`;

  try {
    await fs.writeFileSync(userPlatformioOverrideIni, platformioContent);
  } catch (e) {
    throw new Error(`Cannot write new content to ${userPlatformioOverrideIni} file\n${e}\n`);
  }
};

const compileCode = async (socket, data) => {
  try {
    await prepareFiles(socket, data);
    const cdRet = shell.cd(tasmotaRepo);
    let outputMessages = [];
    let lastEmmit = 0;

    const MAX_MESSAGE_BUFFER_SIZE = 2;
    let bufferSize = 0.1; // starting buffer size
    const bufferSizeIncrement = 0.1;

    const MAX_EMIT_DELAY = 220;
    let emitDelay = 10; // starting emit delay
    const emitDelayIncrement = 5;

    function emitBuffer() {
      if (outputMessages.length >= bufferSize && Date.now() - lastEmmit >= emitDelay) {
        let messageToEmit;
        if (bufferSize <= 1) {
          messageToEmit = outputMessages.shift();
        } else {
          messageToEmit = outputMessages.slice(0, Math.floor(bufferSize)).join('');
          outputMessages = outputMessages.slice(Math.floor(bufferSize));
        }

        socket.emit('message', messageToEmit);
        // increment buffer size
        if (bufferSize < MAX_MESSAGE_BUFFER_SIZE) bufferSize += bufferSizeIncrement;
        // increment delay
        if (emitDelay < MAX_EMIT_DELAY) emitDelay += emitDelayIncrement;
        lastEmmit = Date.now();
      }
    }

    if (cdRet.code !== 0) {
      socket.emit('message', cdRet.stderr);
      socket.emit('finished', {
        status: cdRet.code,
        message: cdRet.stderr,
      });
      debug(cdRet.stderr);
      return;
    }

    const child = shell.exec('pio run', {
      silent: true,
      async: true,
    });

    child.on('exit', (code, signal) => {
      const message = `Finished. Exit code: ${code}.\n`;
      socket.emit('message', outputMessages.join(''));
      socket.emit('message', message);
      socket.emit('finished', {
        ok: code === 0,
      });
      debug(message);
    });

    child.stderr.on('data', (stderrData) => {
      outputMessages.push(stderrData);
      emitBuffer();
      debug(stderrData);
    });

    child.stdout.on('data', (stdoutData) => {
      outputMessages.push(stdoutData);
      emitBuffer();
      debug(stdoutData);
    });
  } catch (e) {
    socket.emit('message', e.message);
    socket.emit('finished', {
      ok: false,
    });
    debug(e);
  }
};

module.exports = {
  compileCode,
};
