module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'plugin:cypress/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.json']
  },
  plugins: ['react'],
  rules: {
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/indent': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
