const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

process.env.NODE_ENV = 'development';

//css以及less/sass/stylus公用loader配置
function commonCssLoader() {
    return [
        MiniCssExtractPlugin.loader,
        'css-loader'
    ];
}

module.exports = {
    // html跟js的HMR需要在entry里面配置
    // entry: ['./src/index.js','./index.html'],
    entry: './src/index.js',
    output: {
        path: resolve(__dirname,'build'),
        filename: 'built.[contenthash:10].js'
    },
    module: {
        rules: [
            /**
             * js兼容性处理：babel-loader、@babel/core、@babel/preset-env
             * 
             * 1.基本js兼容性处理 --> @babel/preset-env
             *   问题：只能解决基本的js兼容性问题
             * 2.解决全部的js兼容问题，例如解析ES6+的polyfill（Promise，Symbol，async等）--> @babel/polyfill
             *   问题：缺点：体积太大，会将所有ES6+的语法转换成ES5）
             * 3.解析ES6+转换，可以通过依赖core-js进行处理 --> core-js
             *   优点：按需引入减少压缩后js的体积
             */
            {
                test: /\.js$/,
                // 需要排除依赖包里的js
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // 指定babel需要做怎样的兼容性处理
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                // 按需加载
                                useBuiltIns: 'usage',
                                // 指定core-js版本
                                corejs: {
                                    version: 3
                                },
                                // 指定兼容性到哪个版本浏览器
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '10',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ]
                    ],
                    // 缓存配置
                    cacheDirectory: true
                }
            },
            // 用于提高js代码规范
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     enforce: 'pre',
            //     loader: 'eslint-loader',
            //     options: {
            //         fix: true
            //     }
            // },
            // 解析less文件，需要依赖 style-loader、css-loader、less-loader
            {
                // 配置的loader只会执行一个
                // 不能同时配置相同类型的文件
                oneOf: [
                    {
                        test: /\.less$/,
                        use: [
                            // 'style-loader',
                            // 'css-loader',
                            ...commonCssLoader(),
                            'less-loader'
                        ]
                    },
                    // 解析css文件，需要依赖 style-loader/css-loader
                    {
                        test: /\.css$/,
                        use: [
                            // 生成style标签形式引入样式
                            // 'style-loader',
                            // 将css文件导出为文件的形式，以link的方式引入
                            // MiniCssExtractPlugin.loader,
                            // 处理import/@import/require引入的内容
                            // 'css-loader',
                            ...commonCssLoader(),
                            /**
                             * 用于适配浏览器css样式，另外需要在package.json里面配置需要适配的浏览器版本
                             * "browserslist": {
                             *     //开发环境  需要配置node环境变量：process.env.NODE_ENV = 'development'，默认是production;
                             *     "development": [
                             *          "last 1 chrome version", //匹配最新的chrome浏览器版本
                             *          "last 1 firefox version",
                             *          ...
                             *     ],
                             *     "production": {
                             *          ">0.2%"
                             *     }
                             * }
                             */
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: () => {
                                        // postcss的插件
                                        require('postcss-preset-env')()
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            //解析html中的资源路径，需要依赖html-loader
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            //其他资源文件，统一用file-loader解析
            {
                exclude: /\.(html|js|css|less|jpg|png|svg)/,
                loader: 'file-loader'
            }
        ]
    },
    // 可以将依赖包单独打包成一个chunk最终输出
    // 如果不配置，则默认所有代码都打包在入口文件里面
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    //模式，设置production可压缩js代码
    mode: 'development',
    devtool: 'cheap-source-map',
    resolve: {
        alias: {
            '@': resolve(__dirname,'src/')
        },
        extensions: ['.js','.json']
    },
    plugins: [
        // 配置html入口文件，不配置默认打包为index.html
        new HtmlWebpackPlugin({
            template: './index.html',
            // html代码压缩
            minify: {
                // 去除空格
                collapseWhitespace: true,
                // 去除注释
                removeComments: true
            }
        }),
        // 提取css作为单独文件
        new MiniCssExtractPlugin({
            // 文件名路径
            filename: 'css/main.[contenthash:10].css'
        }),
        // css打包压缩插件
        new OptimizeCssAssetsWebpackPlugin()
    ],
    devServer: {
        static: {
            directory: resolve(__dirname,'build')
        },
        // 采用gzip压缩
        compress: true,
        port: 3000,
        open: true,
        /**
         * 模块热更新，默认只对配置了style-loader的css样式生效，对html、js不生效
         * 
         * 如果想对html、js生效，需要在entry里面配置html跟js的入口文件
         */
        hot: true
    }
};