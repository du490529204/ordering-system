import request from '../utils/request'
export const getGoodsList = () => request.get('/goods/list')
export const addGoods = (data) => request.post('/goods/add', data)
export const editGoods = (data) => request.post('/goods/edit', data)
export const delGoods = (id) => request.post('/goods/del', { id })