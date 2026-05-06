const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [rows] = await pool.query('SELECT * FROM admin WHERE username=? AND password=?', [username, password])
  if (rows.length === 0) return res.json({ code: 400, msg: '账号或密码错误' })
  res.json({ code: 200, data: { token: 'admin-token' } })
})

module.exports = router