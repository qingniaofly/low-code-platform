const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./common.config')
const TerserPlugin = require('terser-webpack-plugin')

const env = {
    PUBLIC_PATH: './',
    NODE_ENV: 'production',
}
module.exports = merge(commonConfig(env), {
    output: {
        publicPath: env.PUBLIC_PATH,
    },
    plugins: [
        // new CleanWebpackPlugin([BUILD_PATH]),
        new webpack.DefinePlugin(
            Object.keys(env).reduce((o, key) => {
                o[key] = JSON.stringify(env[key])
                return o
            }, {})
        ),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                exclude: /node_modules/,
                terserOptions: {
                    output: {
                        comments: false,
                        beautify: false,
                    },
                },
            }),
        ],
    },
    mode: env.NODE_ENV,
})
