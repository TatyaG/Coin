const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = (env) => ({
    entry: './src/index.js',
    output: {
        filename: 'main.[contenthash].js',
        publicPath: '/',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s?css$/,
                use: [
                    env.prod ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader"
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env']
                    ]
                  }
                }
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Coin',

        }),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css',
        }),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
    },
    
    optimization: {
        minimizer: [           
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    },


})

