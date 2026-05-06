<template>
  <div>
    <h2 style="margin-bottom:16px">订单管理</h2>

    <el-card shadow="hover" style="margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        
        <span>下单时间：</span>
        <el-select v-model="timeRange" style="width:160px" @change="getList">
          <el-option label="今天" value="today" />
          <el-option label="昨天" value="yesterday" />
          <el-option label="本周" value="thisWeek" />
          <el-option label="上周" value="lastWeek" />
          <el-option label="本月" value="thisMonth" />
          <el-option label="上月" value="lastMonth" />
          <el-option label="本季度" value="thisQuarter" />
          <el-option label="上季度" value="lastQuarter" />
          <el-option label="今年" value="thisYear" />
          <el-option label="自选" value="custom" />
        </el-select>

        <el-date-picker
          v-if="timeRange === 'custom'"
          v-model="customDate"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="getList"
        />

        <span style="margin-left:8px">供应商：</span>
        <el-select v-model="supplierId" style="width:180px" @change="getList" placeholder="所有供应商">
          <el-option label="所有供应商" value="" />
          <el-option v-for="s in supplierList" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>

        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
        <el-button type="success" @click="exportOrders">导出数据</el-button>

        <div style="margin-left:auto;font-weight:bold">
          总件数：{{ totalNum }} 件
        </div>
      </div>
    </el-card>

    <el-table :data="list" border>
      <el-table-column prop="id" label="订单号" sortable @sort="sortChange" />
      <el-table-column prop="goods_name" label="商品名称" sortable @sort="sortChange" />
      <el-table-column prop="num" label="补货数量" sortable @sort="sortChange" />
      <el-table-column prop="supplier_name" label="供应商" sortable @sort="sortChange" />
      <el-table-column prop="employee_name" label="下单员工" sortable @sort="sortChange" />
      <el-table-column prop="status" label="状态" sortable @sort="sortChange">
        <template #default="scope">
          <el-select v-model="scope.row.status" @change="changeStatus(scope.row)">
            <el-option label="待处理" value="0" />
            <el-option label="已发货" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="下单时间" sortable @sort="sortChange" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as ExcelJS from 'exceljs'
import { getOrderList, editOrderStatus } from '../api/order'
import { getSupplierList } from '../api/supplier'

const list = ref([])
const supplierList = ref([])
const timeRange = ref('today')
const customDate = ref([])
const supplierId = ref('')
const sortField = ref('')
const sortOrder = ref('')
const totalNum = computed(() => list.value.reduce((sum, item) => sum + Number(item.num || 0), 0))

onMounted(async () => {
  supplierList.value = (await getSupplierList()).data
  getList()
})

async function getList() {
  const res = await getOrderList({
    timeRange: timeRange.value,
    supplierId: supplierId.value,
    startDate: customDate.value?.[0] || '',
    endDate: customDate.value?.[1] || '',
    sortField: sortField.value,
    sortOrder: sortOrder.value
  })
  list.value = res.data
}

function sortChange(column) {
  sortField.value = column.prop
  sortOrder.value = column.order === 'ascending' ? 'asc' : 'desc'
  getList()
}

function resetFilter() {
  timeRange.value = 'today'
  customDate.value = []
  supplierId.value = ''
  sortField.value = ''
  sortOrder.value = ''
  getList()
}

async function changeStatus(row) {
  await editOrderStatus({ id: row.id, status: row.status })
  ElMessage.success('状态更新成功')
}

async function exportOrders() {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('订单数据')
  sheet.columns = [
    { header: '订单号', key: 'id' },
    { header: '商品名称', key: 'goods_name' },
    { header: '补货数量', key: 'num' },
    { header: '供应商', key: 'supplier_name' },
    { header: '下单员工', key: 'employee_name' },
    { header: '状态', key: 'status' },
    { header: '下单时间', key: 'create_time' }
  ]
  list.value.forEach(item => {
    sheet.addRow({ ...item, status: ['待处理', '已发货', '已完成'][item.status] })
  })
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '订单数据.xlsx'
  a.click()
}
</script>