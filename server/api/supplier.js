
const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM supplier')
  res.json({ code: 200, data: rows })
})

router.post('/add', async (req, res) => {
  const { name, phone, contact } = req.body
  await pool.query('INSERT INTO supplier (name, phone, contact) VALUES (?,?,?)', [name, phone, contact])
  res.json({ code: 200, msg: '成功' })
})

router.post('/edit', async (req, res) => {
  const { id, name, phone, contact } = req.body
  await pool.query('UPDATE supplier SET name=?, phone=?, contact=? WHERE id=?', [name, phone, contact, id])
  res.json({ code: 200, msg: '成功' })
})

router.post('/del', async (req, res) => {
  await pool.query('DELETE FROM supplier WHERE id=?', [req.body.id])
  res.json({ code: 200, msg: '成功' })
})

module.exports = router