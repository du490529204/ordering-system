const express = require('express')
const router = express.Router()
const pool = require('../db')

function genId() {
  return Date.now() + '' + Math.random().toString(10).substr(2, 6)
}

router.post('/add', async (req, res) => {
  try {
    const id = genId()
    const { goods_id, goods_name, goods_attr, num, employee_name, supplier_id, supplier_name, supplier_phone } = req.body
    await pool.query(`INSERT INTO orders (id, goods_id, goods_name, goods_attr, num, employee_name, supplier_id, supplier_name, supplier_phone)
      VALUES (?,?,?,?,?,?,?,?,?)`, [id, goods_id, goods_name, goods_attr, num, employee_name, supplier_id, supplier_name, supplier_phone])
    res.json({ code: 200 })
  } catch (err) {
    res.json({ code: 500, msg: err.message })
  }
})

router.get('/list', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE employee_name=? ORDER BY create_time DESC', [req.query.employee_name])
  res.json({ code: 200, data: rows })
})

router.post('/allList', async (req, res) => {
  let { timeRange, supplierId, startDate, endDate, sortField, sortOrder } = req.body;

  let sql = `
    SELECT 
      id,
      goods_name,
      num,
      supplier_name,
      employee_name,
      status,
      DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') AS create_time
    FROM orders
    WHERE 1=1
  `;
  let params = [];

  if (timeRange === "today") {
    sql += " AND DATE(create_time) = CURDATE()";
  } else if (timeRange === "yesterday") {
    sql += " AND DATE(create_time) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
  } else if (timeRange === "thisWeek") {
    sql += " AND YEARWEEK(create_time,1) = YEARWEEK(NOW(),1)";
  } else if (timeRange === "lastWeek") {
    sql += " AND YEARWEEK(create_time,1) = YEARWEEK(NOW(),1)-1";
  } else if (timeRange === "thisMonth") {
    sql += " AND DATE_FORMAT(create_time,'%Y-%m') = DATE_FORMAT(NOW(),'%Y-%m')";
  } else if (timeRange === "lastMonth") {
    sql += " AND DATE_FORMAT(create_time,'%Y-%m') = DATE_FORMAT(DATE_SUB(NOW(),INTERVAL 1 MONTH),'%Y-%m')";
  } else if (timeRange === "thisQuarter") {
    sql += " AND QUARTER(create_time) = QUARTER(NOW()) AND YEAR(create_time) = YEAR(NOW())";
  } else if (timeRange === "lastQuarter") {
    sql += " AND QUARTER(create_time) = QUARTER(NOW())-1 AND YEAR(create_time) = YEAR(NOW())";
  } else if (timeRange === "thisYear") {
    sql += " AND YEAR(create_time) = YEAR(NOW())";
  } else if (timeRange === "custom" && startDate && endDate) {
    sql += " AND create_time BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  if (supplierId && supplierId !== "") {
    sql += " AND supplier_id = ?";
    params.push(supplierId);
  }

  const allowFields = ['id','goods_name','num','supplier_name','employee_name','create_time']
  if (sortField && allowFields.includes(sortField)) {
    sql += ` ORDER BY ${sortField} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`
  } else {
    sql += " ORDER BY create_time DESC"
  }

  const [rows] = await pool.query(sql, params);
  res.json({ code: 200, data: rows });
})

router.post('/editStatus', async (req, res) => {
  const { id, status } = req.body;
  await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
  res.json({ code: 200 });
})

module.exports = router