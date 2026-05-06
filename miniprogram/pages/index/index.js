import request from '../../utils/request'
Page({
  data: {
    goodsList: [],
    showList: [],
    keywords: '',
    activeTab: 0,
    priceTabs: [],
    priceRanges: []
  },

  onShow() {
    this.getGoodsList()
  },

  async getGoodsList() {
    const res = await request('/goods/list')
    if (res.code === 200) {
      const goodsList = res.data || []
      this.setData({ goodsList, showList: goodsList })
      this.createPriceRanges(goodsList)
    }
  },

  createPriceRanges(goodsList) {
    if (goodsList.length === 0) return
    const prices = goodsList.map(item => Number(item.price)).filter(p => !isNaN(p))
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const step = Math.ceil((max - min) / 3) || 10

    let ranges = [], tabs = []
    for (let i = 0; i < 3; i++) {
      const start = min + i * step
      const end = start + step
      ranges.push({ start, end })
      tabs.push(`${start.toFixed(0)}-${end.toFixed(0)}元`)
    }
    this.setData({ priceRanges: ranges, priceTabs: tabs })
  },

  onSearch(e) {
    this.setData({ keywords: e.detail.value })
    this.filterList()
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({ activeTab: index })
    this.filterList()
  },

  filterList() {
    const { goodsList, keywords, activeTab, priceRanges } = this.data
    let list = [...goodsList]

    if (keywords.trim()) {
      list = list.filter(item => item.goods_name.includes(keywords.trim()))
    }

    if (activeTab > 0) {
      const range = priceRanges[activeTab - 1]
      if (range) {
        list = list.filter(item => {
          const p = Number(item.price) || 0
          return p >= range.start && p <= range.end
        })
      }
    }

    this.setData({ showList: list })
  },

  goOrder(e) {
    const item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `/pages/orderAdd/orderAdd?goods=${item}`
    })
  }
})