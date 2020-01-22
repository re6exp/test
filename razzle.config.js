/* eslint-disable prefer-object-spread */
const path = require('path')
const LoadableWebpackPlugin = require('@loadable/webpack-plugin')
const LoadableBabelPlugin = require('@loadable/babel-plugin')
const babelPresetRazzle = require('razzle/babel')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const postcssNormalize = require('postcss-normalize')

const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader
		},
		{
			loader: require.resolve('css-loader'),
			options: cssOptions
		},
		{
			loader: require.resolve('postcss-loader'),
			options: {
				ident: 'postcss',
				plugins: () => [
					require('postcss-flexbugs-fixes'),
					require('postcss-preset-env')({
						autoprefixer: {
							flexbox: 'no-2009'
						},
						stage: 3
					}),
					postcssNormalize()
				],
				sourceMap: false
			}
		}
	].filter(Boolean)

	if (preProcessor) {
		loaders.push({
			loader: require.resolve(preProcessor),
			options: {
				sourceMap: false
			}
		})
	}
	return loaders
}

module.exports = {
	plugins: [
		{
			name: 'typescript',
			options: {
				useBabel: true,
				tsLoader: {
					transpileOnly: true,
					experimentalWatchApi: true
				},
				forkTsChecker: {
					tsconfig: './tsconfig.json',
					tslint: './tslint.json',
					watch: './src',
					typeCheck: true
				}
			}
		}
	],

	modify: (config, { target, dev }, webpack) => {
		const appConfig = Object.assign({}, config)

		if (target === 'web') {
			const filename = path.resolve(__dirname, 'build')

			appConfig.plugins = [
				...appConfig.plugins,
				new LoadableWebpackPlugin({
					outputAsset: false,
					writeToDisk: { filename }
				})
			]

			appConfig.output.filename = dev
				? 'static/js/[name].js'
				: 'static/js/[name].[chunkhash:8].js'

			appConfig.node = { fs: 'empty' } // fix "Cannot find module 'fs'" problem.

			appConfig.optimization = Object.assign({}, appConfig.optimization, {
				runtimeChunk: true,
				splitChunks: {
					chunks: 'all',
					name: dev
				}
			})
		}

		appConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: 'static/css/bundle.[contenthash:8].css',
				chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
				allChunks: true
			})
		)

		appConfig.module.rules.push(
			{
				test: sassRegex,
				exclude: sassModuleRegex,
				use: getStyleLoaders(
					{
						importLoaders: 2,
						sourceMap: false
					},
					'sass-loader'
				),
				sideEffects: true
			},
			{
				test: sassModuleRegex,
				use: getStyleLoaders(
					{
						importLoaders: 2,
						sourceMap: false,
						modules: true,
						getLocalIdent: getCSSModuleLocalIdent
					},
					'sass-loader'
				)
			}
		)
		return appConfig
	},

	modifyBabelOptions: () => ({
		babelrc: false,
		presets: [babelPresetRazzle],
		plugins: [LoadableBabelPlugin]
	})
}
