var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: './src/app.js',
    output: {
        path: './dist',
        filename: 'js/[name].bundle.js'
    },
    module: {
        loaders: [{
                test: /\.js$/,
                loader: 'babel',
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                query: {
                    presets: ['latest']
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.tpl/,
                loader: 'ejs-loader'
            },
            {
                test: /\.css$/,
                loader: 'style!css?importLoaders=1!postcss'
            },
            {
                test: /\.less$/,
                loader: 'style!css!postcss!less'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!postcss!sass'
            },
            {
                test: /\.png|jpg|gif|svg$/i, // image 可用 file-loader 和 url-loader image-loader 处理
                loaders: [
                    'url-loader?limit=1000&name=assets/[name]-[hash:5].[ext]',
                    'image-webpack'
                    ]
            }
        ]
    },
    postcss: [
        require('autoprefixer')({
            browsers: ['last 5 versions']
        })
    ],
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body'
        })
    ]

}