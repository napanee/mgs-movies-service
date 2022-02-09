/**
 * @see https://webpack.js.org/guides/typescript/#loader
 */
export const typescriptRule = {
	test: /\.tsx?$/,
	loader: 'ts-loader',
	options: {
		transpileOnly: true,
	},
	exclude: /node_modules/,
};

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
export const htmlRule = {
	test: /\.(html)$/,
	use: {
		loader: 'html-loader',
	},
};
