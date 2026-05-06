<template>
  <div>
    <h2 style="margin-bottom:16px">商品管理</h2>

    <el-card shadow="hover" style="margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <el-input v-model="searchName" placeholder="商品名称" style="width:180px" />
        <el-input v-model="minPrice" placeholder="最低售价" type="number" style="width:140px" />
        <el-input v-model="maxPrice" placeholder="最高售价" type="number" style="width:140px" />
        <el-button type="primary" @click="getList()">搜索</el-button>
        <el-button @click="resetSearch()">重置</el-button>

        <div style="margin-left:auto">
          <el-button type="success" @click="downloadTemplate">下载导入模板</el-button>
          <el-upload :auto-upload="false" :on-change="importExcel" accept=".xlsx,.xls" :show-file-list="false">
            <el-button type="primary">批量导入</el-button>
          </el-upload>
          <el-button type="primary" @click="openDialog">新增商品</el-button>
        </div>
      </div>
    </el-card>

    <el-table :data="list" border>
      <el-table-column prop="id" label="ID" sortable @sort="sortChange" />
      <el-table-column prop="goods_name" label="商品名称" sortable @sort="sortChange" />
      <el-table-column prop="brand" label="品牌" sortable @sort="sortChange" />
      <el-table-column prop="price" label="售价" sortable @sort="sortChange" />
      <el-table-column prop="cost" label="进价" sortable @sort="sortChange" />
      <el-table-column prop="supplier_name" label="供应商" sortable @sort="sortChange" />
      <el-table-column prop="goods_attr" label="自定义属性" min-width="120" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="商品信息" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="商品名称" required>
          <el-input v-model="form.goods_name" placeholder="必填" style="width:300px" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="form.brand" style="width:300px" />
        </el-form-item>
        <el-form-item label="售价" required>
          <el-input v-model="form.price" type="number" style="width:200px" />
        </el-form-item>
        <el-form-item label="进价">
          <el-input v-model="form.cost" type="number" style="width:200px" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="form.supplier_id" style="width:300px">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义属性">
          <el-input v-model="form.goods_attr" style="width:300px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as ExcelJS from 'exceljs'
import { getGoodsList, addGoods, editGoods, delGoods } from '../api/goods'
import { getSupplierList } from '../api/supplier'

const list = ref([])
const supplierList = ref([])
const dialogVisible = ref(false)
const form = ref({ id: '', goods_name: '', brand: '', price: '', cost: '', goods_attr: '', supplier_id: '' })
const searchName = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const sortField = ref('')
const sortOrder = ref('')

onMounted(async () => {
  supplierList.value = (await getSupplierList()).data
  getList()
})

async function getList() {
  const params = {
    name: searchName.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    sortField,
    sortOrder
  }
  const res = await getGoodsList(params)
  list.value = res.data
}

function sortChange(column) {
  sortField.value = column.prop
  sortOrder.value = column.order === 'ascending' ? 'asc' : 'desc'
  getList()
}

function resetSearch() {
  searchName.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  sortField.value = ''
  sortOrder.value = ''
  getList()
}

function openDialog(row = {}) {
  form.value = { id: '', goods_name: '', brand: '', price: '', cost: '', goods_attr: '', supplier_id: '', ...row }
  dialogVisible.value = true
}

async function submit() {
  if (!form.value.goods_name) return ElMessage.warning('请填写商品名称')
  if (!form.value.price) return ElMessage.warning('请填写售价')
  form.value.supplier_id = form.value.supplier_id || null
  form.value.id ? await editGoods(form.value) : await addGoods(form.value)
  ElMessage.success('保存成功')
  dialogVisible.value = false
  getList()
}

async function del(id) {
  await delGoods(id)
  ElMessage.success('删除成功')
  getList()
}

async function downloadTemplate() {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('商品模板')
  sheet.columns = [
    { header: '商品名称', key: 'goods_name' },
    { header: '品牌', key: 'brand' },
    { header: '售价', key: 'price' },
    { header: '进价', key: 'cost' },
    { header: '自定义属性', key: 'goods_attr' },
    { header: '供应商ID', key: 'supplier_id' }
  ]
  sheet.addRow({ goods_name: '示例商品', brand: '乐满家', price: 10, cost: 8, goods_attr: '规格', supplier_id: 1 })
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '商品导入模板.xlsx'
  a.click()
}

async function importExcel(file) {
  const workbook = new ExcelJS.Workbook()
  const buffer = await file.raw.arrayBuffer()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.worksheets[0]
  const rows = sheet.getRows(2, sheet.rowCount - 1)
  for (const row of rows) {
    const data = {
      goods_name: row.getCell(1).value,
      brand: row.getCell(2).value || '',
      price: row.getCell(3).value || 0,
      cost: row.getCell(4).value || 0,
      goods_attr: row.getCell(5).value || '',
      supplier_id: row.getCell(6).value || null
    }
    if (data.goods_name && data.price) await addGoods(data)
  }
  ElMessage.success('导入完成')
  getList()
}
</script>