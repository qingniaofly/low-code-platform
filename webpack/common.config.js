const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

module.exports = (env) => {
    return {
        entry: {
            main: path.resolve(__dirname, '../src/index.tsx'),
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, '../build'),
            // publicPath: './'
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: {
                path: require.resolve('path-browserify'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                // cacheDirectory: true,
                                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                                // plugins: ['@babel/plugin-transform-runtime'],
                                compact: process.env.NODE_ENV === 'production',
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        'css-loader',
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'sass-loader',
                        },
                    ],
                },
                {
                    test: /\.(gif|jpg?g|png|svg|woff|eot|ttf|ico)\??.*$/,
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        name: '../public/images/[name].[ext]',
                    },
                },
            ],
        },
        plugins: [
            // // new CleanWebpackPlugin([BUILD_PATH]),
            // new webpack.DefinePlugin({
            //     'process.env': {
            //         CLIENT_ENV: JSON.stringify('client'),
            //         IS_MAC_ENV: JSON.stringify(process.env.IS_MAC || ''), //定义编译环境
            //     },
            // })
            new MiniCssExtractPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../public/static'),
                        to: 'static',
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                title: 'app',
                // inject: true,
                inject: 'body',
                showErrors: true,
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                chunks: ['main'],
            }),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
        ],
        optimization: {
            minimize: false,
            splitChunks: {
                // chunks: 'all',
                // minChunks: 2,
                // name: 'vendor',
                cacheGroups: {
                    antd: {
                        chunks: 'all',
                        test: /antd|@ant-design|rc-\S+|moment/,
                        name: 'antd',
                        priority: 30,
                    },
                    vendor: {
                        chunks: 'all',
                        test: /react|react-dom|lodash|redux|md5|prop-types|react-redux|rxjs/,
                        name: 'vendor',
                        priority: 30,
                    },
                },
            },
        },
        stats: 'errors-only',
        externals: {},
    }
}
