const app = getApp()

const mockCategories = [
  { 
    id: 'wangchuang', 
    name: '网创专区', 
    items: [
      { id: 'ai', name: 'AI风口', icon: '🤖', bg: '#6366f1' },
      { id: 'project', name: '实战项目', icon: '💰', bg: '#f59e0b' },
      { id: 'tool', name: '免费工具', icon: '🔧', bg: '#22c55e' },
      { id: 'promote', name: '引流推广', icon: '👥', bg: '#8b5cf6' },
      { id: 'ecommerce', name: '电商运营', icon: '🛒', bg: '#ef4444' },
      { id: 'copywriting', name: '文案写作', icon: '✍️', bg: '#f97316' },
      { id: 'media', name: '自媒体', icon: '📱', bg: '#10b981' },
      { id: 'community', name: '社群营销', icon: '🤝', bg: '#0ea5e9' },
      { id: 'shortvideo', name: '短视频', icon: '🎬', bg: '#ec4899' },
      { id: 'more', name: '全部分类', icon: '📂', bg: '#6b7280' }
    ] 
  },
  { 
    id: 'platform', 
    name: '各大平台', 
    items: [
      { id: 'zhongchuang', name: '中创网', icon: '赚', bg: '#fff', border: '#ef4444', custom: true },
      { id: 'fuyuan', name: '福缘网', icon: '福', bg: '#fff', border: '#22c55e', custom: true },
      { id: 'maopao', name: '冒泡网', icon: '赚', bg: '#fef3c7', border: '#f59e0b', custom: true }
    ] 
  },
  { 
    id: 'tool-lib', 
    name: '工具库', 
    items: [
      { id: 'testtool', name: '亲测好用', icon: '🛠️', bg: '#1f2937' },
      { id: 'composite', name: '综合工具', icon: '🔊', bg: '#f97316' }
    ] 
  }
]

const allResources = [
  {
    _id: '1',
    title: 'AI一键生成短剧',
    desc: 'AI智能生成短剧脚本，一键生成，含配套工具',
    tag: '实战项目',
    price: 129,
    vip: true,
    hot: true,
    cover: '🎬'
  },
  {
    _id: '2',
    title: '抖音7W粉干货教学',
    desc: '7W粉丝干货教学，从0到1做抖音，快速涨粉变现',
    tag: '学习教程',
    price: 89,
    vip: true,
    hot: false,
    cover: '📱'
  },
  {
    _id: '3',
    title: '年入百W路径课',
    desc: '年入百万路径规划，从0到1，教你如何快速变现',
    tag: '网创项目',
    price: 199,
    vip: true,
    hot: true,
    cover: '💰'
  },
  {
    _id: '4',
    title: '全域矩阵流量陪跑',
    desc: '全域矩阵流量玩法，多平台布局，流量翻倍，变现无忧',
    tag: '实战项目',
    price: 159,
    vip: false,
    hot: false,
    cover: '📊'
  },
  {
    _id: '5',
    title: '跨境AI社群',
    desc: '跨境电商AI社群，最新跨境玩法，AI工具助力',
    tag: '学习教程',
    price: 99,
    vip: true,
    hot: false,
    cover: '🌍'
  },
  {
    _id: '6',
    title: '2026TikTok shop运营课',
    desc: 'TikTok shop跨境电商运营课，从0到1做TikTok店铺',
    tag: '实战项目',
    price: 169,
    vip: true,
    hot: true,
    cover: '🛍️'
  },
  {
    _id: '7',
    title: '2026抖爆粉技术',
    desc: '抖音爆粉技术揭秘，快速涨粉，流量密码大公开',
    tag: '实用工具',
    price: 79,
    vip: false,
    hot: false,
    cover: '🚀'
  },
  {
    _id: '8',
    title: 'ai自媒体写作，智能体创建合集',
    desc: 'AI自媒体写作教程，智能体创建方法，轻松做自媒体',
    tag: '学习教程',
    price: 109,
    vip: true,
    hot: false,
    cover: '📝'
  },
  {
    _id: '9',
    title: '国内电商运营高端运营合集',
    desc: '国内电商高端运营合集，淘宝京东拼多多运营技巧',
    tag: '网创项目',
    price: 149,
    vip: true,
    hot: false,
    cover: '🛒'
  },
  {
    _id: '10',
    title: '短视频带货实战',
    desc: '短视频带货实战教程，从选品到变现，全程实战教学',
    tag: '实战项目',
    price: 99,
    vip: false,
    hot: true,
    cover: '🎥'
  },
  {
    _id: '11',
    title: '互联网行业的铁饭碗 AI代写',
    desc: 'AI代写教程，互联网写作，轻松做副业，稳定收入',
    tag: '实用工具',
    price: 89,
    vip: false,
    hot: true,
    cover: '💻'
  },
  {
    _id: '12',
    title: '闲鱼电商最新实战课程',
    desc: '闲鱼电商最新实战课程，无货源模式，小白也能做',
    tag: '学习教程',
    price: 79,
    vip: true,
    hot: false,
    cover: '🐟'
  },
  {
    _id: '13',
    title: '拼多多虚拟电商',
    desc: '拼多多虚拟电商教程，虚拟产品高利润，轻松上手',
    tag: '网创项目',
    price: 119,
    vip: true,
    hot: false,
    cover: '🎁'
  },
  {
    _id: '14',
    title: '小红书笔记速成课',
    desc: '小红书运营教程，爆款笔记写作技巧',
    tag: '学习教程',
    price: 89,
    vip: true,
    hot: false,
    cover: '📖'
  },
  {
    _id: '15',
    title: '微信群引流变现全攻略',
    desc: '微信群引流教程，精准粉丝获取方法',
    tag: '实战项目',
    price: 129,
    vip: true,
    hot: false,
    cover: '💬'
  },
  {
    _id: '16',
    title: 'SEO搜索引擎优化课',
    desc: 'SEO优化教程，搜索引擎排名提升技巧',
    tag: '实用工具',
    price: 99,
    vip: true,
    hot: false,
    cover: '🔍'
  }
]

function mockResources(catName, showAll) {
  if (showAll) {
    return allResources
  }
  const list = []
  for (let i = 1; i <= 12; i++) {
    list.push({
      _id: `resource-${Date.now()}-${i}`,
      title: `${catName} 精品项目 ${i}`,
      price: Math.floor(Math.random() * 199) + 9,
      isVip: Math.random() > 0.4,
      cover: ''
    })
  }
  return list
}

function getActiveGroup(data) {
  const group = data.categoryGroups.find(g => g.id === data.activeGroupId)
  return group || data.categoryGroups[0]
}

Page({
  data: {
    statusBarHeight: 0,
    categoryGroups: [],
    activeGroupId: 'wangchuang',
    activeGroupName: '',
    activeGroupItems: [],
    activeSubId: '',
    showAllResources: false,
    resources: [],
    page: 1,
    hasMore: true,
    loading: false
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })
    
    let initialId = 'wangchuang'
    let initialSubId = 'ai'
    let showAll = false
    
    if (options.categoryId) {
      for (let g of mockCategories) {
        const foundItem = g.items.find(item => item.id === options.categoryId)
        if (foundItem) {
          initialId = g.id
          initialSubId = options.categoryId
          if (options.categoryId === 'more') {
            showAll = true
          }
          break
        }
      }
    }
    
    this.setData({ 
      categoryGroups: mockCategories,
      activeGroupId: initialId,
      activeSubId: initialSubId,
      showAllResources: showAll
    })
    this.refreshActiveGroup()
    this.loadResources()
  },

  refreshActiveGroup() {
    const g = getActiveGroup(this.data)
    if (g) {
      this.setData({
        activeGroupName: g.name,
        activeGroupItems: g.items
      })
    }
  },

  onGroupTap(e) {
    const id = e.currentTarget.dataset.id
    const group = this.data.categoryGroups.find(g => g.id === id)
    const firstItem = group ? group.items[0] : null
    this.setData({ 
      activeGroupId: id, 
      activeSubId: firstItem ? firstItem.id : '',
      showAllResources: false,
      page: 1, 
      resources: [] 
    })
    this.refreshActiveGroup()
    this.loadResources()
  },

  onSubCategoryTap(e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    
    if (id === 'more') {
      this.setData({
        showAllResources: true,
        activeSubId: 'more',
        page: 1,
        resources: []
      })
      this.loadResources()
    } else {
      this.setData({ showAllResources: false })
      wx.navigateTo({
        url: `/pages/category-detail/category-detail?categoryId=${id}&categoryName=${encodeURIComponent(name)}`
      })
    }
  },

  loadResources() {
    this.setData({ loading: true })
    const group = getActiveGroup(this.data)
    const groupName = group ? group.name : '资源'

    setTimeout(() => {
      this.setData({ 
        resources: mockResources(groupName, this.data.showAllResources),
        loading: false,
        page: 2,
        hasMore: true
      })
    }, 300)
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    this.setData({ loading: true })
    setTimeout(() => {
      const group = getActiveGroup(this.data)
      let newItems = []
      
      if (this.data.showAllResources) {
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * allResources.length)
          newItems.push({
            ...allResources[randomIndex],
            _id: `more-all-${Date.now()}-${i}`
          })
        }
      } else {
        for (let i = 1; i <= 6; i++) {
          newItems.push({
            _id: `more-${Date.now()}-${i}`,
            title: `${group.name} 更多资源 ${i}`,
            price: Math.floor(Math.random() * 199) + 9,
            isVip: Math.random() > 0.4,
            cover: ''
          })
        }
      }
      
      this.setData({
        resources: [...this.data.resources, ...newItems],
        loading: false,
        page: this.data.page + 1,
        hasMore: this.data.resources.length < 30
      })
    }, 500)
  },

  onResourceTap(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.resources.find(r => r._id === id) || {}
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
