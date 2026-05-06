<template>
  <el-container style="height:100vh">
    <el-aside width="200px" style="background:#fff">
      <el-menu router default-active="/goods">
        <el-menu-item index="/goods">商品管理</el-menu-item>
        <el-menu-item index="/supplier">供应商管理</el-menu-item>
        <el-menu-item index="/order">补货订单</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        style="
          background: #1677ff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          position: relative;
        "
      >
        乐满家补货系统
        <el-button
          link
          type="light"
          @click="logout"
          style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color:#fff"
        >
          退出
        </el-button>
      </el-header>

      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>