const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // 你的MySQL用户名
  password: '123456',     // 你的MySQL密码
  database: 'replenish',
  charset: 'utf8mb4'
})

module.exports = pool
