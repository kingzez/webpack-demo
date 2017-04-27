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
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                // include: './src',
                include: path.resolve(__dirname, 'src'),                
                exclude: path.resolve(__dirname, 'node_modules'),
                query: {
                    presets: ['latest']
                }
            },
            {
               test: /\.css$/,
               loader: 'style-loader!css-loader?importLoaders=1!postcss-loader',
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