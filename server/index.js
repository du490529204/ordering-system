const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 接口挂载
app.use('/api/admin', require('./api/admin'))
app.use('/api/goods', require('./api/goods'))
app.use('/api/supplier', require('./api/supplier'))
app.use('/api/order', require('./api/order'))

app.listen(port, () => {
  console.log('服务器运行在 http://localhost:3000')
})
