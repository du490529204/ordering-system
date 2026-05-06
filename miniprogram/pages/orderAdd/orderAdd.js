import request from '../../utils/request'
Page({
  data: { goods: {}, num: 1 },
  onLoad(options) {
    const goods = JSON.parse(options.goods)
    this.setData({ goods })
  },
  numAdd() {
    this.setData({ num: this.data.num + 1 })
  },
  numCut() {
    if(this.data.num <= 1) return
    this.setData({ num: this.data.num - 1 })
  },
  async submit() {
    const goods = this.data.goods
    const employeeName = wx.getStorageSync('employeeName')
    const params = {
      goods_id: goods.id,
      goods_name: goods.goods_name,
      goods_attr: goods.goods_attr,
      supplier_id: goods.supplier_id,
      supplier_name: goods.supplier_name,
      supplier_phone: goods.supplier_phone,
      num: this.data.num,
      employee_name: employeeName
    }
    const res = await request('/order/add', params, 'POST')
    if(res.code === 200) {
      wx.showModal({
        title: "提交成功",
        content: `已生成补货单\n供应商：${goods.supplier_name}\n电话：${goods.supplier_phone}`,
        confirmText: "复制电话",
        success: (r) => {
          if(r.confirm) wx.setClipboardData({ data: goods.supplier_phone })
          wx.navigateBack()
        }
      })
    }
  }
})