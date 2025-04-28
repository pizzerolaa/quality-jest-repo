module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier'
    ],
    plugins: ['react'],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: true,
      es2021: true,
      jest: true,
      node: true
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      
    }
  };