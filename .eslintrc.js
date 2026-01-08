// eslint-disable-next-line no-undef
module.exports = {
  env: {
    'browser': true,
    'es2021': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    project: ['./tsconfig.json',],
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'indent': [
      'error',
      2,
      { "SwitchCase": 1 },
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error', {
        'arrays': 'only-multiline',
        'objects': 'only-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      },
    ],
    'object-curly-spacing' : [
      'error',
      'always',
    ],
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'padded-blocks': [
      'error',
      'never',
    ],
    'no-trailing-spaces': [
      'error',
      {
        "skipBlankLines": true,
      }
    ],'react/no-unknown-property': [
      'error',
      {
        'ignore': [
          'intensity', 'position', 'args', 'object', 'geometry', 'material', 
          'attach', 'castShadow', 'receiveShadow', 'rotation', 'scale', 
          'dispose', 'target', 'angle', 'penumbra', 'decay', 'distance'
        ] 
      }
    ],
  },
};