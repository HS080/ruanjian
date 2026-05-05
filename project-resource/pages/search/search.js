const app = getApp()

const allIndexResources = [
  {
    _id: '1',
    title: 'AI一键生成短剧',
    desc: 'AI智能生成短剧脚本，一键生成，含配套工具',
    tag: '实战项目',
    price: 129,
    vip: true,
    hot: true,
    cover: '🎬',
    time: '2小时前',
    tabType: 'hot'
  },
  {
    _id: '2',
    title: '抖音7W粉干货教学',
    desc: '7W粉丝干货教学，从0到1做抖音，快速涨粉变现',
    tag: '学习教程',
    price: 89,
    vip: true,
    hot: false,
    cover: '📱',
    time: '5小时前',
    tabType: 'hot'
  },
  {
    _id: '3',
    title: '年入百W路径课',
    desc: '年入百万路径规划，从0到1，教你如何快速变现',
    tag: '网创项目',
    price: 199,
    vip: true,
    hot: true,
    cover: '💰',
    time: '昨天',
    tabType: 'hot'
  },
  {
    _id: '4',
    title: '全域矩阵流量陪跑',
    desc: '全域矩阵流量玩法，多平台布局，流量翻倍，变现无忧',
    tag: '实战项目',
    price: 159,
    vip: false,
    hot: false,
    cover: '📊',
    time: '2天前',
    tabType: 'hot'
  },
  {
    _id: '5',
    title: '跨境AI社群',
    desc: '跨境电商AI社群，最新跨境玩法，AI工具助力',
    tag: '学习教程',
    price: 99,
    vip: true,
    hot: false,
    cover: '🌍',
    time: '3天前',
    tabType: 'hot'
  },
  {
    _id: '6',
    title: '2026TikTok shop运营课',
    desc: 'TikTok shop跨境电商运营课，从0到1做TikTok店铺',
    tag: '实战项目',
    price: 169,
    vip: true,
    hot: true,
    cover: '🛍️',
    time: '3天前',
    tabType: 'hot'
  },
  {
    _id: '7',
    title: '2026抖爆粉技术',
    desc: '抖音爆粉技术揭秘，快速涨粉，流量密码大公开',
    tag: '实用工具',
    price: 79,
    vip: false,
    hot: false,
    cover: '🚀',
    time: '4天前',
    tabType: 'new'
  },
  {
    _id: '8',
    title: 'ai自媒体写作，智能体创建合集',
    desc: 'AI自媒体写作教程，智能体创建方法，轻松做自媒体',
    tag: '学习教程',
    price: 109,
    vip: true,
    hot: false,
    cover: '📝',
    time: '5天前',
    tabType: 'new'
  },
  {
    _id: '9',
    title: '国内电商运营高端运营合集',
    desc: '国内电商高端运营合集，淘宝京东拼多多运营技巧',
    tag: '网创项目',
    price: 149,
    vip: true,
    hot: false,
    cover: '🛒',
    time: '1周前',
    tabType: 'new'
  },
  {
    _id: '10',
    title: '短视频带货实战',
    desc: '短视频带货实战教程，从选品到变现，全程实战教学',
    tag: '实战项目',
    price: 99,
    vip: false,
    hot: true,
    cover: '🎥',
    time: '1周前',
    tabType: 'new'
  },
  {
    _id: '11',
    title: '互联网行业的铁饭碗 AI代写',
    desc: 'AI代写教程，互联网写作，轻松做副业，稳定收入',
    tag: '实用工具',
    price: 89,
    vip: false,
    hot: true,
    cover: '💻',
    time: '2周前',
    tabType: 'new'
  },
  {
    _id: '12',
    title: '小红书笔记速成课',
    desc: '小红书运营教程，爆款笔记写作技巧',
    tag: '学习教程',
    price: 89,
    vip: true,
    hot: false,
    cover: '📖',
    time: '2周前',
    tabType: 'free'
  },
  {
    _id: '13',
    title: '闲鱼电商最新实战课程',
    desc: '闲鱼电商最新实战课程，无货源模式，小白也能做',
    tag: '学习教程',
    price: 79,
    vip: true,
    hot: false,
    cover: '🐟',
    time: '2周前',
    tabType: 'free'
  },
  {
    _id: '14',
    title: '微信群引流变现全攻略',
    desc: '微信群引流教程，精准粉丝获取方法',
    tag: '实战项目',
    price: 129,
    vip: true,
    hot: false,
    cover: '💬',
    time: '3周前',
    tabType: 'free'
  },
  {
    _id: '15',
    title: 'SEO搜索引擎优化课',
    desc: 'SEO优化教程，搜索引擎排名提升技巧',
    tag: '实用工具',
    price: 99,
    vip: true,
    hot: false,
    cover: '🔍',
    time: '1月前',
    tabType: 'free'
  },
  {
    _id: '16',
    title: '拼多多虚拟电商',
    desc: '拼多多虚拟电商教程，虚拟产品高利润，轻松上手',
    tag: '网创项目',
    price: 119,
    vip: true,
    hot: false,
    cover: '🎁',
    time: '1月前',
    tabType: 'free'
  }
]

const hotSearches = ['AI', '抖音', '电商', '短视频', '小红书', 'SEO']

Page({
  data: {
    statusBarHeight: 0,
    searchValue: '',
    searchHistory: [],
    hotSearches: hotSearches,
    hasSearched: false,
    searchResults: []
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync()
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ 
      statusBarHeight: sys.statusBarHeight || 20,
      searchHistory: history
    })
    
    if (options.keyword) {
      const keyword = decodeURIComponent(options.keyword)
      this.setData({ searchValue: keyword })
      this.doSearch(keyword)
    }
  },

  onBack() {
    wx.navigateBack()
  },

  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value })
  },

  onSearchConfirm(e) {
    const keyword = e.detail.value || this.data.searchValue
    if (keyword.trim()) {
      this.doSearch(keyword)
    }
  },

  onClearSearch() {
    this.setData({ 
      searchValue: '',
      hasSearched: false,
      searchResults: []
    })
  },

  onHistoryTap(e) {
    const text = e.currentTarget.dataset.text
    this.setData({ searchValue: text })
    this.doSearch(text)
  },

  onHotSearchTap(e) {
    const text = e.currentTarget.dataset.text
    this.setData({ searchValue: text })
    this.doSearch(text)
  },

  onClearHistory() {
    wx.removeStorageSync('searchHistory')
    this.setData({ searchHistory: [] })
  },

  doSearch(keyword) {
    const kw = keyword.trim().toLowerCase()
    
    this.addToHistory(kw)
    
    const results = allIndexResources.filter(item => 
      item.title.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw) ||
      item.tag.toLowerCase().includes(kw)
    )
    
    this.setData({
      searchResults: results,
      hasSearched: true
    })
  },

  addToHistory(keyword) {
    let history = [...this.data.searchHistory]
    const index = history.indexOf(keyword)
    
    if (index > -1) {
      history.splice(index, 1)
    }
    
    history.unshift(keyword)
    
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    
    wx.setStorageSync('searchHistory', history)
    this.setData({ searchHistory: history })
  },

  onResourceTap(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.searchResults.find(r => r._id === id) || {}
    const data = {
      title: item.title || '资源标题',
      date: '2026-05-03',
      isVip: item.vip || item.isVip,
      views: Math.floor(Math.random() * 999) + 100,
      cover: ''
    }
    wx.navigateTo({
      url: '/pages/detail/detail?data=' + encodeURIComponent(JSON.stringify(data))
    })
  }
})
