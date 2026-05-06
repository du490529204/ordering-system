import request from '../utils/request'
export const getSupplierList = () => request.get('/supplier/list')
export const addSupplier = (data) => request.post('/supplier/add', data)
export const editSupplier = (data) => request.post('/supplier/edit', data)
export const delSupplier = (id) => request.post('/supplier/del', { id })