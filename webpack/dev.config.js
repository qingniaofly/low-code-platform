const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./common.config')

const env = {
    PUBLIC_PATH: '',
    NODE_ENV: 'development',
}
module.exports = merge(commonConfig(env), {
    devtool: 'inline-source-map',
    output: {
        publicPath: env.PUBLIC_PATH,
    },
    plugins: [
        new webpack.DefinePlugin(
            Object.keys(env).reduce((o, key) => {
                o[key] = JSON.stringify(env[key])
                return o
            }, {})
        ),
    ],
    mode: env.NODE_ENV,
})
