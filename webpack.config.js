var webpack = require('webpack');
var fs = require('fs');

/*************webpack config****************/
module.exports = {
    // watch: true,
    //页面入口
    entry: {
     "test": "./test/test.js",
    },
    //出口文件输出配置
    output: {
        path: "./test",
        filename: '[name].min.js'
    },
    //source map 支持
    devtool: '',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin()
    ],
    //加载器
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }],
        loaders: [{
            test: /\.sass$/,
            loader: 'style!css!sass'
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass'
        }, {
            test: /\.styl$/,
            loader: "style!css!stylus"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader!less-loader"
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.txt$/,
            loader: "raw"
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /.*\.(png|jpg|jpe?g|ico|gif|svg)$/i, 
            loaders: [
                'image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
                'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            ]
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
