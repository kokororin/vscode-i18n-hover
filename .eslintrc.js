module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true,
  },
  extends: ['kotori'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    'no-invalid-this': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/array-type': ['error', { default: 'array' }]
  }
};
