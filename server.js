const express = require('express')
const path = require('path')
const proxy = require('express-http-proxy');
const app1 = express()

app1.use(express.static(path.resolve(__dirname, '')))
app1.listen(1240, () => {
    console.log('eg:http://localhost:1240/webGL/gl4-texture.html')
    console.log('eg:http://localhost:1240/webGL/gl5-texture2卷积.html')
    console.log('eg:http://localhost:1240/webGL/gl6-texture3效果叠加.html')   
    console.log('eg:http://localhost:1240/transform3D/2d.html') 
    //  http://localhost:1240/transform3D/3d.html
})


// // Qtrade hera项目本地服务搭建：压缩包 dist ， backdoor.html 复制过来即可：

// app1.use('/hera',express.static(path.resolve(__dirname,'dist')))   // 这样做映射！！！
// app1.use('/hera/backdoor.html',express.static(path.resolve(__dirname,'backdoor.html')))

// const serverUrl = 'https://test.qtrade.com.cn'
// const proxies = [
//     '/qtrade_ums',
// '/websocket-worker-0.1.17.js',   // 仍然报错，这个要怎么代理？
// '/qtrade_base_business',
// '/qtrade_bond',
// '/primary_bond_sale',
// '/bond-basic',
// '/qtrade_bond_trade',
// '/qtrade-fund',
// '/qtrade-app-box',
// ]
// for(let uri of proxies){
//     app1.use(uri,proxy(serverUrl,{
//         proxyReqPathResolver(req){
//             return `${uri}${req.url}`
//         }
//     }))
// }

// // app1.use('/websocket-worker-0.1.17.js',proxy(serverUrl))


// app1.listen(9888,()=>{
//     console.log('ff: http:localhost:9887/hera/index.html')
// })
