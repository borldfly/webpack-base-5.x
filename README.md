# 调试类

# source-map: 一种 提供源代码到构建后代码的映射技术  （如果构建代码出错，可以自动追踪到源代码相应的位置）
#  value: [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

#  source-map: 外部
    错误代码准确信息 和 源代码的错误位置
#  inline-source-map: 内联
    只生成一个内联的source-map
    错误代码准确信息 和 源代码的错误位置
    缺点：代码体积增大（采用的是base64压缩的形式）
#  hidden-source-map: 外部
    错误代码错误原因：但是没有错误位置
    不能追踪到源代码错误，只能提示到构建后代码的错误位置
#  eval-source-map: 内联（vue-cli采用的方式）
    每一个文件都生成对应的source-map，都在eval
    错误代码准确信息 和 源代码的错误位置   
#  nosources-source-map: 外部
    错误代码准确位置，但是没有任何源代码信息
#  cheap-source-map: 外部
    错误代码准确信息 和 源代码的错误位置  
    只能精确到行
#  cheap-module-source-map: 外部
    错误代码准确信息 和 源代码的错误位置  
    module会将loader的source-map加入

#  开发环境: 速度快、调试友好
    速度快：
        eval-cheap-source-map
        eval-source-map
    调试友好：
        source-map
        cheap-module-source-map
        cheap-source-map
#  生成环境: 源代码是否需要隐藏？是否需要调试友好
    不显示源码：
        nosources-source-map
        hidden-source-map



# 性能优化类

# 生成hash值的3个API：
    hash|chunkhash|contenthash
    hash/chunkhash
        都是根据打包后的hash值命名，这样设置会导致如果设置了缓存，hash值发生改变，文件也会重新打包
    contenthash（用于性能优化）
        hash值根据文件内容而定，如果默认加了缓存，文件内容发生改变，打包后也会保持不变，还是原来的hash值

# tree shaking：去除无用代码
    前提：1.必须使用ES6语法；2.必须为production环境
    作用：减少代码体积
    在package.json中配置
        "sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
        缺点：会去掉样式文件
        优化措施：设置过滤器数组，数组里配置不进行tree shaking的文件
        例如："sideEffects": [*.css] => .css的文件不采用tree shaking

# lazy loading(懒加载)
    不进行文件初始化，需要import('filename.js').then(callback)形式进行加载




