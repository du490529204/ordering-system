Page({
  data: { name: "" },
  inputName(e) {
    this.setData({ name: e.detail.value })
  },
  login() {
    const name = this.data.name.trim()
    if (!name) {
      wx.showToast({ title: "请输入姓名", icon: "none" })
      return
    }
    wx.setStorageSync("employeeName", name)
    getApp().globalData.employeeName = name
    wx.switchTab({ url: "/pages/index/index" })
  }
})