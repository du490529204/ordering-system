const app = getApp()
export default function request(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      data,
      method,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        wx.showToast({ title: "网络错误", icon: "none" })
        reject(err)
      }
    })
  })
}