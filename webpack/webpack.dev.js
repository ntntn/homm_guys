const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
    mode: 'development',
    stats: 'errors-warnings',
    devtool: 'eval',
    devServer: {
        open: true,
        port: 40000,
        host: 'local-ipv4',
    }
}

module.exports = merge(common, dev)