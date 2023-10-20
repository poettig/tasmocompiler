module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true,
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', {'vars': 'all', 'args': 'none', 'ignoreRestSiblings': false}],
    'max-len': ['error', { code: 120 }],
  },
};
