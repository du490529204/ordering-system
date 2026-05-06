import request from '../utils/request'
// export const getOrderList = () => request.get('/order/allList')
export function getOrderList(data) {
    return request({
      url: '/order/allList',
      method: 'post', // 这里是 POST
      data
    })
  }
export const editOrderStatus = (data) => request.post('/order/editStatus', data)