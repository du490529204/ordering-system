const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/list', async (req, res) => {
  let { name, minPrice, maxPrice, sortField, sortOrder } = req.query
  let sql = 'SELECT * FROM goods WHERE 1=1'
  let params = []

  if (name) { sql += ' AND goods_name LIKE ?'; params.push('%' + name + '%') }
  if (minPrice) { sql += ' AND price >= ?'; params.push(minPrice) }
  if (maxPrice) { sql += ' AND price <= ?'; params.push(maxPrice) }

  const allowSort = ['goods_name', 'price']
  if (sortField && allowSort.includes(sortField)) {
    sql += ` ORDER BY ${sortField} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`
  } else {
    sql += ' ORDER BY id DESC'
  }

  const [rows] = await pool.query(sql, params)
  res.json({ code: 200, data: rows })
})

router.post('/add', async (req, res) => {
  let { goods_name, price, cost, goods_attr, supplier_id } = req.body
  if (supplier_id === '') supplier_id = null
  const [sup] = await pool.query('SELECT name FROM supplier WHERE id=?', [supplier_id])
  const supplier_name = sup[0]?.name || ''
  await pool.query(
    'INSERT INTO goods (goods_name, price, cost, goods_attr, supplier_id, supplier_name) VALUES (?,?,?,?,?,?)',
    [goods_name, price, cost, goods_attr, supplier_id, supplier_name]
  )
  res.json({ code: 200 })
})

router.post('/edit', async (req, res) => {
  let { id, goods_name, price, cost, goods_attr, supplier_id } = req.body
  if (supplier_id === '') supplier_id = null
  const [sup] = await pool.query('SELECT name FROM supplier WHERE id=?', [supplier_id])
  const supplier_name = sup[0]?.name || ''
  await pool.query(
    'UPDATE goods SET goods_name=?, price=?, cost=?, goods_attr=?, supplier_id=?, supplier_name=? WHERE id=?',
    [goods_name, price, cost, goods_attr, supplier_id, supplier_name, id]
  )
  res.json({ code: 200 })
})

router.post('/del', async (req, res) => {
  await pool.query('DELETE FROM goods WHERE id=?', [req.body.id])
  res.json({ code: 200 })
})

module.exports = router