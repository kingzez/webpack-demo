# webpack基础配置纪实
<!--more-->

## entry 打包入口配置
接受三种方式：string， array， object

```javascript
module.exports = {
    entry: './src/main.js'
    ...
}
```

```javascript
module.exports = {
    entry: ['./src/main.js', './src/test.js']
    ...
}
```

```javascript
module.exports = {
    entry: {
        main: './src/main.js',
        test: './src/test.js'
    }
    ...
}
```

## output 打包导出配置

```javascript
module.exports = {
    entry: {
        main: './src/main.js',
        a: './src.a.js'
    },
    output: {
        path: './dist',
        filename: 'js/[name]-[chunkhash].js',
        publicPath: 'http://cdn.com/'
    }
    ...
}
```

path：打包后导出的文件路径

filename：打包后的文件名

    [name]对应文件名
    [hash]打包文件hash值
    [chunkhash]打包后每个单独文件的hash值
publicPath：打包上线环境，用来替换文件路径

## plugins 插件系统(数组)

html-webpack-plugin 自动化生成项目中的html页面

通过npm安装

```bash
$ npm install html-webpack-plugin --save-dev
```

在webpack.config.js中

```javascript
var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.js',
        a: './src/a.js',
        b: './src/b.js',
        c: './src/c.js'
    },
    output: {
        path: './dist',
        filename: [name]-[chunkhash].js,
        public: 'http:cdn.com/'
    },
    plugins: [
        //创建一个htmlWebpackPlugin对象，并传入值
        new htmlWebpackPlugin({
            template: 'index.html', //生成html文件的模板文件
            filename: 'a.html', //目标文件的名称
            inject: false,  //插入html文档中的位置，value分别为 true，false，head，body
            title: 'this is a.html', // 传入的html的title
            excludeChunks: ['b', 'c'] // 引入的除b.js 与c.js以外的js文件
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

```

index.html模板文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- 在webpack中默认识别ejs -->
    <!-- title的值为htmlWebpackPlugin传入的值 -->
    <title><%= htmlWebpackPlugin.options.title %></title>
    <script>
        // js的行内引入方法
        <%= compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source() %>
    </script>
</head>
<body>
    <!-- 再通过循环遍历除去main.js 外联引入对应的js -->
    <% for (var k in htmlWebpackPlugin.files.chunks) { %>
        <% if (k != 'main') { %>
            <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks[k].entry %>"></script>
        <% } %>
    <% } %>
</body>
</html>
```

>- html-webpack-plugin更多api移步[官方api](https://github.com/jantimon/html-webpack-plugin)查看

>- 涉及webpack源码的[行内引入js](https://github.com/jantimon/html-webpack-plugin/blob/master/examples/inline/template.jade#L10)

至此工程目录结构为

![](http://7xkghm.com1.z0.glb.clouddn.com/image/blog/webpack-demo-1.pngj)

关于html-webpack-plugin插件的使用，工程源码

```shell
git clone https://github.com/kingzez/webpack-demo.git
```

首先切换到

```shell
git checkout html-webpack-plugin
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看效果。


## Loaders

> - babel-loader
> - css-loader
> - style-loader
> - postcss-loader
> - less-loader
> - sass-loader
> - html-loader
> - ejs-loader
> - file-loader
> - url-loader
> - image-webpack-loader

Loaders 同样也是一个数组，需要定义在一个module中

```javascript
module: {
    loaders: [
        ...
    ]
}
```

### babel-loader
babel-loader 用于对ES6的代码的转换，首先在终端中执行npm
```shell
npm install --save-dev babel-loader babel-core
```
然后再webpack.config.js中加入

```javascript
module.exports = {
    context: '__dirname',
    entry: './src/app.js',
    output: {
        path: './dist',
        filename: 'js/[name].bundle.js'
    },
    module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel',
                    include: path.resolve(__dirname, 'src'), //path.resolve node的api，用于处理路径；__dirname为当前项目目录，
                    exclude: path.resolve(__dirname, 'node_modules'),
                    query: {
                        presets: ['latest'] // babel的配置，可在webpack.config.js中配置也可在package.json或创建.babelrc文件
                    }
            }
        ]
    }
}
```

### css-loader & style-loader & postcss-loader
css-loader 用于处理css模块的打包, style-loader 用于将打包好的css模块插入html中,安装


```shell
npm install --save-dev css-loader
```

```shell
npm install --save-dev style-loader
```

在webpack.config.js中加入

```javascript
loaders: [
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader' // loader处理顺序是css-loader打包css文件，后通过style-loader插入到html中
    }
]
```

在处理浏览器兼容的情况下，需要对各个浏览器加前缀，这时需要css后处理器postcss-loader，安装

```shell
npm install --save-dev postcss-loader
```

```shell
npm install --save-dev autoprefixer // 自动添加前缀
```

在webpack.config.js中加入

```javascript
module: {
    loaders: [
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader!postcss-loader' // loader处理顺序post-loader处理后加上浏览器的前缀，再由css-loader打包css文件，后通过style-loader插入到html中
        }
    ]
},
postcss: [
    require('autoprefixer')({
        browsers: ['last 5 versions'] //浏览器的最新五个版本
    })
],

```

如果多个css文件之间存在`@import`，以上配置还需要修改

```javascript
module: {
    loaders: [
        {
            test: /\.css$/,
            loader: 'style!css?importLoaders=1!postcss' // css-loader的importLoaders参数可以解决@import的css文件不处理的问题
        }
    ]
},
postcss: [
    require('autoprefixer')({
        browsers: ['last 5 versions'] //浏览器的最新五个版本
    })
],

```

关于babel-loader css-loader style-loader postcss-loader 的使用，工程源码

```shell
git checkout css-style-postcss-loader
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看效果。

### less-loader & sass-loader
less-loader 是对less文件进行处理打包，安装

```shell
npm install --save-dev less-loader
```

在webpack.config.js中加入

```javascript
loaders: [
    {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
    }
]
```

关于less-loader 的使用，工程源码

```shell
git checkout less-loader
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看效果。

sass-loader同理不做过多介绍，简单看一下webpack.config.js

```javascript
loaders: [
    {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
    }
]
```

### html-loader & ejs-loader
html-loader 和 ejs-loader 用于处理模板文件，如果你在一个js文件中`import html from 'somewhere'`，接着  `npm run webpack` 会看到报错信息，说没有处理器处理html文件，so 安装

```shell
npm install --save-dev html-loader
```

同样也可以处理ejs模板文件，该ejs模板文件的扩展名也可以自定义，这里我们定义`tpl`

```shell
npm install --save-dev ejs-loader
```

看一下在 webpack.config.js 中

```javascript
loaders: [
        {
            test: /\.html$/,
            loader: 'html-loader'
        },
        {
            test: /\.tpl/,
            loader: 'ejs-loader'
        }
]
```
关于html-loader ejs-loader 的使用，工程源码，可分别执行

```shell
git checkout less-loader
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看html-loader的效果。

```shell
git checkout ejs-loader
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看ejs-loader的效果。


### file-loader & url-loader & image-webpack-loader
用于处理图片以及其他文件，例子中对图片处理，先用file-loader处理，那么安装

```shell
npm install --save-dev file-loader
```
安装完成后对webpack.config.js配置进行修改

```javascript
loaders: [
    {
         test: /\.png|jpg|gif|svg$/i, //用于匹配各种扩展名结尾的文件
         loader: 'file-loader',
         query: {
             name: 'assets/[name]-[hash:5].[ext]' // 可选 用于将图片打包到assets文件夹中
         }
    }
]
```

在根目录中的index.html css 中的`img` `background` 的图片引用一般为相对路径，最佳解决方案为线上的CDN绝对路径，在模板文件中的图片引用如果一定要使用相对路径的话，需要这样

```html
 <img src="${ require('../../assets/avator.png') }" />
```

详细代码请看我的工程项目源码，关于 file-loader 的使用，工程源码，执行

```shell
git reset 3a85b87d461b86682491c5c7a8b096584a44a354
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看 file-loader 的效果。


url-loader 同样也可以实现图片的处理，安装

```shell
npm install --save-dev url-loader
```

安装完成后，看一下webpack.config.js

```javascript
loaders: [
    {
        test: /\.png|jpg|gif|svg$/i, // image 可用 file-loader 和 url-loader image-loader 处理
        loader: 'url-loader',
        query: {
            limit: 20000, //定义限制图片打包大小，超过限制值，会将图片转成base64写入
            name: 'assets/[name]-[hash:5].[ext]'
        }
    }
]
```
较好的方案是 url-loader 与 image-webpack-loader 结合使用，安装

```shell
npm install --save-dev image-webpack-loader
```

安装完成后，看一下webpack.config.js中

```javascript
loaders: [
    {
        test: /\.png|jpg|gif|svg$/i, // image 可用 file-loader 和 url-loader image-loader 处理
        loaders: [
            'url-loader?limit=1000&name=assets/[name]-[hash:5].[ext]',
            'image-webpack'
            ]
    }
]
```

首先通过 image-webpackloader 压缩图片后处理再由url-loader处理，通过参数`limit`限制图片大小，图片超过limit限制的值将转成base64，如果没超过限制值，则正常打包图片。

关于 url-loader 与 image-webpack-loader 的使用，工程源码，执行

```shell
git checkout image-webpack-loader
```

并执行 `npm install` 完成依赖的安装后执行 `npm run webpack` 查看 url-loader 与 image-webpack-loader 结合的效果。

完整的webpack.config.js demo查看，请执行

```shell
git checkout release
```

本纪实经过本人实际操作后的记录，算为入门级的实践。




