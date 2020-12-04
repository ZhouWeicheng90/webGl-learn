const express = require('express')
const path = require('path')
const app1 = express()
app1.use(express.static(path.resolve(__dirname, '')))
app1.listen(1240, () => {

    console.log('eg:http://localhost:1240/webGL/gl4-texture.html')
    console.log('eg:http://localhost:1240/webGL/gl5-texture2卷积.html')
    console.log('eg:http://localhost:1240/webGL/gl6-texture3效果叠加.html')   
    console.log('eg:http://localhost:1240/transform3D/2d.html') 
    //  http://localhost:1240/transform3D/3d.html
})