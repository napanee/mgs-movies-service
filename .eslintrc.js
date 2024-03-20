const path = require('path');


module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['import', 'import-alias', '@typescript-eslint', 'typescript-sort-keys'],
	env: {
		browser: true,
		jest: true,
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	parserOptions: {
		project: path.resolve(__dirname, './tsconfig.json'),
		tsconfigRootDir: __dirname,
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	rules: {
		'arrow-parens': ['error', 'always'],
		'implicit-arrow-linebreak': 'off',
		'max-len': [
			'error',
			{
				code: 120,
				ignoreComments: true,
			},
		],
		curly: ['error', 'all'],
		'nonblock-statement-body-position': ['error', 'below'],
		'padded-blocks': ['error', 'never'],
		'padding-line-between-statements': [
			'error',
			{blankLine: 'always', prev: ['const', 'let', 'if', 'for'], next: '*'},
			{blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let']},
			{blankLine: 'always', prev: '*', next: 'return'},
		],
		'no-multiple-empty-lines': [
			'error',
			{
				max: 2,
				maxBOF: 0,
				maxEOF: 1,
			},
		],
		'no-duplicate-imports': 'error',
		'no-trailing-spaces': 'error',
		'no-whitespace-before-property': 'error',
		'object-curly-newline': [
			'error', {
				'multiline': true,
				'consistent': true,
			}
		],
		'object-curly-spacing': ['error', 'never'],
		'one-var': ['error', 'never'],
		'quotes': ['error', 'single'],
		'sort-imports': [
			'error',
			{
				allowSeparatedGroups: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
			},
		],
		'arrow-body-style': 'off',
		'no-console': 'error',
		'space-before-blocks': 'error',
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'space-in-parens': ['error', 'never'],

		'import-alias/import-alias': ['error', {'relativeDepth': 1}],

		'import/newline-after-import': ['error', {'count': 2}],
		'import/no-extraneous-dependencies': 'off',
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
				groups: ['builtin', 'external', 'internal', 'sibling', 'index', 'parent'],
				pathGroups: [
					{
						pattern: '@pages/**',
						group: 'internal',
						position: 'before'
					},
					{
						pattern: '~/**',
						group: 'internal',
						position: 'before'
					}
				],
				'newlines-between': 'always',
			},
		],
		'import/prefer-default-export': 'off',

		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/object-curly-spacing': ['error', 'never'],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': ['error', {
			'multiline': {
				'delimiter': 'semi',
				'requireLast': true
			},
			'singleline': {
				'delimiter': 'semi',
				'requireLast': false
			},
			'multilineDetection': 'brackets',
		}],
		// '@typescript-eslint/member-ordering': 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variable',
				types: ['boolean'],
				format: ['PascalCase'],
				prefix: ['can', 'has', 'is'],
			},
		],
		'@typescript-eslint/comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
			},
		],
		'@typescript-eslint/semi': 'error',

		'typescript-sort-keys/interface': [
			'error',
			'asc',
			{
				caseSensitive: true,
				natural: false,
				requiredFirst: true,
			},
		],
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.js', '.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: path.resolve(__dirname, './tsconfig.json'),
			},
		},
	},
};
