# webpack基础配置纪实
<!--more-->
## 配置

### entry 打包入口配置
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

### output 打包导出配置

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

### plugins 插件系统(数组)

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

![](http://7xkghm.com1.z0.glb.clouddn.com/image/blog/webpack-demo-1.png)