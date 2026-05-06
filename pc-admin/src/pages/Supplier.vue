<template>
    <div>
      <el-button type="primary" @click="openDialog">新增供应商</el-button>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="openDialog(scope.row)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog v-model="dialogVisible" title="供应商">
        <el-form model="form" label-width="100px">
          <el-form-item label="名称"><el-input v-model="form.name" required /></el-form-item>
          <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
          <el-form-item label="联系人"><el-input v-model="form.contact" /></el-form-item>
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
  import { getSupplierList, addSupplier, editSupplier, delSupplier } from '../api/supplier'
  import { ElMessage } from 'element-plus'
  const list = ref([])
  const dialogVisible = ref(false)
  const form = ref({ id: '', name: '', phone: '', contact: '' })
  
  onMounted(async () => { list.value = (await getSupplierList()).data })
  const openDialog = (row = {}) => { form.value = { id: '', name: '', phone: '', contact: '', ...row }; dialogVisible.value = true }
  const submit = async () => { form.value.id ? await editSupplier(form.value) : await addSupplier(form.value); ElMessage.success('保存成功'); dialogVisible.value = false; list.value = (await getSupplierList()).data }
  const del = async (id) => { await delSupplier(id); ElMessage.success('删除成功'); list.value = (await getSupplierList()).data }
  </script>