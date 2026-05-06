import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.token = token
  return config
})

// 响应拦截器
request.interceptors.response.use(res => {
  if (res.data.code !== 200) {
    ElMessage.error(res.data.msg || '请求失败')
    return Promise.reject(res.data)
  }
  return res.data
}, err => {
  ElMessage.error('网络错误')
  return Promise.reject(err)
})

export default request