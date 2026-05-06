import request from '../../utils/request'
Page({
  data: { orderList: [] },
  onShow() {
    this.getOrderList()
  },
  async getOrderList() {
    const name = wx.getStorageSync('employeeName')
    const res = await request('/order/list', { employee_name: name })
    if(res.code === 200) {
      this.setData({ orderList: res.data })
    }
  }
})