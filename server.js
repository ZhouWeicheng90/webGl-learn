const express = require('express')
const path = require('path')
const app1 = express()
app1.use(express.static(path.resolve(__dirname, '')))
app1.listen(1240, () => {
    console.log('web workers: http://localhost:1240')
    console.log('eg:http://localhost:1240/webGL/gl4.html')
})