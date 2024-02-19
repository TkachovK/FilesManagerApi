module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'eslint-plugin-import',
    'unused-imports',
    'unicorn',
  ],
  ignorePatterns: ['jest.config.ts', 'dist'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'eqeqeq': 'error',
    'no-console': 'off',
    'no-debugger': 'off',
    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'padded-blocks': ['error', 'never'],
    'keyword-spacing': ['error', { 'before': true, 'after': true, 'overrides': { 'function': { 'after': false } } }],
    'no-multi-spaces': ['error'],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    'max-len': ['error', {
      'code': 120,
      'ignoreUrls': true,
      'tabWidth': 2,
      'ignoreRegExpLiterals': true,
      'ignoreTrailingComments': true,
      'ignoreComments': true,
    }],
    'eol-last': ['error'],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', { 'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always' }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error'],
    'space-unary-ops': ['error', { 'words': true, 'nonwords': false, 'overrides': { 'typeof': false } }],
    'strict': ['error', 'global'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'comma-style': ['error', 'last'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true,
      'mode': 'minimum',
    }],
    'new-cap': ['error', {
      'newIsCap': true,
      'capIsNew': false,
      'properties': true,
    }],
    'no-loop-func': ['error'],
    'new-parens': ['error'],
    'no-lonely-if': ['error'],
    'no-unneeded-ternary': ['error'],
    'no-whitespace-before-property': ['error'],
    'no-unreachable': ['error'],
    'no-self-compare': ['error'],
    'no-unmodified-loop-condition': ['error'],
    'no-constant-condition': ['error', { 'checkLoops': false }],
    'no-useless-concat': ['error'],
    'no-useless-escape': ['error'],
    'no-useless-computed-key': ['error'],
    'no-useless-rename': ['error'],
    'no-var': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    'prefer-numeric-literals': ['error'],
    'prefer-rest-params': ['error'],
    'prefer-spread': ['error'],
    'rest-spread-spacing': ['error', 'never'],
    'operator-assignment': ['error', 'always'],
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error'],
    'no-confusing-arrow': ['error', { 'allowParens': true }],
    'object-shorthand': ['error', 'always'],
    'template-curly-spacing': ['error', 'never'],
    'no-use-before-define': ['error', { 'functions': false } ],
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-promise-executor-return': 'error',
    'no-template-curly-in-string': 'error',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/newline-after-import': 1,
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' },
    ],
    'unicorn/prefer-node-protocol': 'error',
  },
  'overrides': [
    // "simple-import-sort" config
    {
      'files': ['*.js', '*.ts'],
      'rules': {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [['^node:'], ['^\\u0000'], ['^@?\\w'], ['^'], ['^\\.'], ['^.*\\u0000$']],
          },
        ],
      },
    },
  ]
  ,
}
