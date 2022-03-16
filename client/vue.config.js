const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    baseUrl: './', // 根據上下文目錄
    outputDir: 'dist', // 輸出目錄
    assetsDir: 'assets', // 靜態資源目錄 (js, css, img, fonts)
    lintOnSave: false, // 是否開啟eslint保存時檢測，有效值：ture | false | 'error'
    runtimeCompiler: true, // 運行時是否要編譯es6
    transpileDependencies: [], // 默認babel-loader忽略mode_modules
    productionSourceMap: true, // 是否在構建生產包時生成 sourceMap 文件，false將提高構建速度
    configureWebpack: config => { // webpack配置，值為對象時會合併配置，為方法時可改寫配置
        if (debug) { // 開發環境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生產環境配置
        }
        // Object.assign(config, { // 開發生產共同配置
        //     resolve: {
        //         alias: {
        //             '@': path.resolve(__dirname, './src'),
        //             '@c': path.resolve(__dirname, './src/components'),
        //             'vue$': 'vue/dist/vue.esm.js'
        //         }
        //     }
        // })
    },
    chainWebpack: config => { // webpack連接API，用於生成和修改webapck配置，https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
        if (debug) {
            // 本地開發配置
        } else {
            // 生產開發配置
        }
    },
    parallel: require('os').cpus().length > 1, // 構鍵時開啟多進程處理babel配置
    pluginOptions: { // 第三方插件配置
    },
    pwa: { // 單頁插件相關配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://localhost:5001/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => { }
    }
}
