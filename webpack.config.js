const webpack = require('webpack');
const Uglify = require("uglifyjs-webpack-plugin");

module.exports = {
    mode: "production",
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
        rules: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [

    ]
};