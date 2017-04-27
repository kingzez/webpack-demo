var htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    // context: __dirname,
    entry: {
        main: './src/script/main.js',
        a: './src/script/a.js',
        b: './src/script/b.js',
        c: './src/script/c.js'         
    },
    output: {
        path: './dist',
        filename: 'js/[name]-[chunkhash].js',
        publicPath: 'http://cdn.com/'
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'index.html',
            filename: 'a.html',
            inject: false,
            title: 'this is a.html',
            excludeChunks: ['b', 'c']
        }),
        new htmlWebpackPlugin({
            template: 'index.html',
            filename: 'b.html',
            inject: false,
            title: 'this is b.html',
            excludeChunks: ['a', 'c']
        }),
        new htmlWebpackPlugin({
            template: 'index.html',
            filename: 'c.html',
            inject: false,
            title: 'this is c.html',
            excludeChunks: ['a', 'b']
        })        
    ]

}