const webpack = require('webpack');
const Uglify = require("uglifyjs-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: {
        'ce-carousel': './src/carousel.component'
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        publicPath: "dist/"
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loaders: ['awesome-typescript-loader'], exclude: /node_modules/ }
        ]
    },
    plugins: [
        new Uglify({
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false
                },
                mangle: {
                    eval: true,
                }
            }
        })
    ]
};
