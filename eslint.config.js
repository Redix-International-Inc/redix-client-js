export default [
  {
    languageOptions: {
      globals: {
        node: true,
        es2021: true,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'indent': ['error', 2],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
  },
];