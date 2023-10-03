module.exports = {
  extends: [
    'react-app',
  ],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: [
          '.js',
          '.jsx',
        ],
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
  },
};
