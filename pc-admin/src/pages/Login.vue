<template>
    <div class="login-box">
      <el-card class="login-card">
        <h2>管理员登录</h2>
        <el-form model="form" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="form.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-button type="primary" @click="handleLogin" block>登录</el-button>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from '../api/admin'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const form = ref({
    username: 'admin',
    password: '123456'
  })
  
  // 把函数名改成 handleLogin，不和接口名冲突
  const handleLogin = async () => {
    try {
      const res = await login(form.value)
      localStorage.setItem('adminToken', res.data.token)
      ElMessage.success('登录成功')
      router.push('/home')
    } catch (e) {
      ElMessage.error('登录失败')
    }
  }
  </script>
  
  <style scoped>
  .login-box{
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    background:#f5f5f5;
  }
  .login-card{
    width:400px;
    padding:20px;
  }
  h2{
    text-align:center;
    margin-bottom:20px;
  }
  </style>