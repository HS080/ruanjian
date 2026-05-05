const app = getApp()

const catList = [
  { id: 'all', name: '全部', icon: '📌' },
  { id: 'wangchuang', name: '网创', icon: '💡' },
  { id: 'tool', name: '工具', icon: '🔧' },
  { id: 'code', name: '源码', icon: '📦' },
  { id: 'course', name: '教程', icon: '📚' },
  { id: 'live', name: '直播', icon: '🎥' },
  { id: 'short', name: '短视频', icon: '🎬' },
  { id: 'data', name: '资料', icon: '📄' }
]

const quickList = [
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

const tabList = [
  { id: 'hot', name: '🔥 热门推荐' },
  { id: 'new', name: '🆕 最新上架' },
  { id: 'free', name: '💰 免费专区' }
]

const allIndexResources = [
  {
    _id: '1',
    title: 'AI一键生成短剧',
    desc: 'AI智能生成短剧脚本，一键生成，含配套工具',
    tag: '实战项目',
    time: '1小时前',
    price: 129,
    vip: true,
    hot: true,
    cover: '🎬',
    tabType: 'hot'
  },
  {
    _id: '2',
    title: '抖音7W粉干货教学',
    desc: '7W粉丝干货教学，从0到1做抖音，快速涨粉变现',
    tag: '学习教程',
    time: '2小时前',
    price: 89,
    vip: true,
    hot: false,
    cover: '📱',
    tabType: 'hot'
  },
  {
    _id: '3',
    title: '年入百W路径课',
    desc: '年入百万路径规划，从0到1，教你如何快速变现',
    tag: '网创项目',
    time: '3小时前',
    price: 199,
    vip: true,
    hot: true,
    cover: '💰',
    tabType: 'hot'
  },
  {
    _id: '4',
    title: '全域矩阵流量陪跑',
    desc: '全域矩阵流量玩法，多平台布局，流量翻倍，变现无忧',
    tag: '实战项目',
    time: '4小时前',
    price: 159,
    vip: false,
    hot: false,
    cover: '📊',
    tabType: 'hot'
  },
  {
    _id: '5',
    title: '跨境AI社群',
    desc: '跨境电商AI社群，最新跨境玩法，AI工具助力',
    tag: '学习教程',
    time: '5小时前',
    price: 99,
    vip: true,
    hot: false,
    cover: '🌍',
    tabType: 'hot'
  },
  {
    _id: '6',
    title: '2026TikTok shop运营课',
    desc: 'TikTok shop跨境电商运营课，从0到1做TikTok店铺',
    tag: '实战项目',
    time: '6小时前',
    price: 169,
    vip: true,
    hot: true,
    cover: '🛍️',
    tabType: 'hot'
  },
  {
    _id: '7',
    title: '2026抖爆粉技术',
    desc: '抖音爆粉技术揭秘，快速涨粉，流量密码大公开',
    tag: '实用工具',
    time: '7小时前',
    price: 79,
    vip: false,
    hot: false,
    cover: '🚀',
    tabType: 'hot'
  },
  {
    _id: '8',
    title: 'ai自媒体写作，智能体创建合集',
    desc: 'AI自媒体写作教程，智能体创建方法，轻松做自媒体',
    tag: '学习教程',
    time: '8小时前',
    price: 109,
    vip: true,
    hot: false,
    cover: '📝',
    tabType: 'hot'
  },
  {
    _id: '9',
    title: '国内电商运营高端运营合集',
    desc: '国内电商高端运营合集，淘宝京东拼多多运营技巧',
    tag: '网创项目',
    time: '9小时前',
    price: 149,
    vip: true,
    hot: false,
    cover: '🛒',
    tabType: 'hot'
  },
  {
    _id: '10',
    title: '短视频带货实战',
    desc: '短视频带货实战教程，从选品到变现，全程实战教学',
    tag: '实战项目',
    time: '10小时前',
    price: 99,
    vip: false,
    hot: true,
    cover: '🎥',
    tabType: 'hot'
  },
  {
    _id: '11',
    title: '互联网行业的铁饭碗 AI代写',
    desc: 'AI代写教程，互联网写作，轻松做副业，稳定收入',
    tag: '实用工具',
    time: '11小时前',
    price: 89,
    vip: false,
    hot: true,
    cover: '💻',
    tabType: 'hot'
  },
  {
    _id: '12',
    title: '闲鱼电商最新实战课程',
    desc: '闲鱼电商最新实战课程，无货源模式，小白也能做',
    tag: '学习教程',
    time: '12小时前',
    price: 79,
    vip: true,
    hot: false,
    cover: '🐟',
    tabType: 'hot'
  },
  {
    _id: '13',
    title: '拼多多虚拟电商',
    desc: '拼多多虚拟电商教程，虚拟产品高利润，轻松上手',
    tag: '网创项目',
    time: '13小时前',
    price: 119,
    vip: true,
    hot: false,
    cover: '🎁',
    tabType: 'hot'
  },
  {
    _id: 'n1',
    title: 'AI数字人最新玩法，月入十万实战分享',
    desc: 'AI数字人课程，商业思维教学，月入十万实战分享',
    tag: '实战项目',
    time: '30分钟前',
    price: 199,
    vip: true,
    hot: true,
    cover: '🎯',
    tabType: 'new'
  },
  {
    _id: 'n2',
    title: '视频号AI民间故事玩法，新手快速上手',
    desc: '视频号AI民间故事玩法，新手快速上手指南',
    tag: '网创项目',
    time: '1小时前',
    price: 129,
    vip: true,
    hot: false,
    cover: '🎬',
    tabType: 'new'
  },
  {
    _id: 'n3',
    title: '小红书笔记速成课，打造爆款笔记',
    desc: '小红书运营教程，爆款笔记写作技巧',
    tag: '学习教程',
    time: '2小时前',
    price: 89,
    vip: true,
    hot: false,
    cover: '📖',
    tabType: 'new'
  },
  {
    _id: 'n4',
    title: '年入百万路径规划，财务自由实战分享',
    desc: '年入百万路径规划，财务自由实战分享',
    tag: '网创项目',
    time: '3小时前',
    price: 299,
    vip: true,
    hot: true,
    cover: '💰',
    tabType: 'new'
  },
  {
    _id: 'n5',
    title: 'AI制作翻页书单号，每天半小时收益破三张',
    desc: '翻页书单号制作教程，AI工具辅助内容创作',
    tag: '实战项目',
    time: '4小时前',
    price: 159,
    vip: true,
    hot: false,
    cover: '📚',
    tabType: 'new'
  },
  {
    _id: 'f1',
    title: '【安卓】金Z配音助手v2.4.1高级版下载',
    desc: '强大的语音合成工具，支持多种音色和语速',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f2',
    title: '【安卓】短视频去水印无痕v1.3高级版下载',
    desc: '一键去除视频水印，支持多个平台',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f3',
    title: '多开浏览器，每个窗口可独立设置IP',
    desc: '防关联神器，每个浏览器窗口独立IP和缓存',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f4',
    title: '剪映破J版',
    desc: '视频剪辑工具，解锁全部VIP功能',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f5',
    title: '克隆大师分身：软件多开',
    desc: '支持软件无限多开，独立运行互不影响',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f6',
    title: '一键抠图换背景工具，神级图片处理工具',
    desc: 'AI智能抠图，一键更换背景，效果超棒',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f7',
    title: '矩阵投屏工具，自媒体人必备，群控多部',
    desc: '一键群控多台手机，自动操作，解放双手',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f8',
    title: 'PC端高清录屏神器，多语便携版下载免激',
    desc: '高清录屏工具，支持多种格式，无需激活',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f9',
    title: '【安卓】白羊音乐V1.1.1 音乐随意听!随意下',
    desc: '免费听歌工具，支持全网音乐搜索和下载',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f10',
    title: '醒图国际高级版v8.2 VIP功能全解锁',
    desc: '图片编辑工具，解锁全部VIP滤镜和功能',
    tag: '亲测好用',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  },
  {
    _id: 'f11',
    title: '实时变声工具(大饼AI变声)支持1000种音色',
    desc: '强大的实时变声工具，支持1000种音色',
    tag: '综合工具',
    time: '刚刚',
    price: 0,
    vip: false,
    hot: false,
    cover: '📁',
    tabType: 'free'
  }
]

function mockResources(type) {
  if (type === 'new') {
    return allIndexResources.filter(r => r.tabType === 'new')
  } else if (type === 'free') {
    return allIndexResources.filter(r => r.tabType === 'free')
  }
  return allIndexResources.filter(r => r.tabType === 'hot')
}

Page({
  data: {
    statusBarHeight: 0,
    searchValue: '',
    catList,
    activeCat: 'all',
    quickList,
    tabList,
    activeTab: 'hot',
    stats: { total: '528', today: '28', users: '1.8W' },
    resourceList: [],
    loading: false,
    hasMore: true,
    page: 1,
    showWelcomeModal: true,
    noticeText: '🎉 整合全网各大资源网站，一次付费，解锁全部VIP资源！',
    noticeOffset: 0
  },

  onLoad() {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })
    this.loadResources()
    this.startNoticeAnimation()
  },

  startNoticeAnimation() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.notice-text').boundingClientRect()
    query.select('.notice-content').boundingClientRect()
    query.exec((res) => {
      if (res[0] && res[1]) {
        const textWidth = res[0].width
        const containerWidth = res[1].width
        if (textWidth > containerWidth) {
          let offset = 0
          const speed = 1
          this.noticeTimer = setInterval(() => {
            offset -= speed
            if (offset < -textWidth) {
              offset = containerWidth
            }
            this.setData({ noticeOffset: offset })
          }, 30)
        }
      }
    })
  },

  onUnload() {
    if (this.noticeTimer) {
      clearInterval(this.noticeTimer)
    }
  },

  closeWelcomeModal() {
    this.setData({ showWelcomeModal: false })
  },

  loadResources() {
    const tabType = this.data.activeTab
    
    wx.cloud.callFunction({
      name: 'resourceManager',
      data: {
        action: 'list',
        data: {
          page: 1,
          pageSize: 20,
          tabType: tabType
        }
      }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          resourceList: res.result.list || [],
          page: 1,
          hasMore: (res.result.list || []).length >= 20
        })
      } else {
        const data = mockResources(tabType)
        this.setData({
          resourceList: data,
          page: 1,
          hasMore: true
        })
      }
    }).catch(err => {
      console.error('加载资源失败，使用本地数据:', err)
      const data = mockResources(tabType)
      this.setData({
        resourceList: data,
        page: 1,
        hasMore: true
      })
    })
  },

  onCatTap(e) {
    this.setData({ activeCat: e.currentTarget.dataset.id })
  },

  onQuickTap(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.quickList.find(q => q.id === id)
    if (item) {
      if (id === 'more') {
        wx.switchTab({ url: '/pages/category/category' })
      } else {
        wx.navigateTo({
          url: `/pages/category-detail/category-detail?categoryId=${id}&categoryName=${encodeURIComponent(item.name)}`
        })
      }
    }
  },

  onTabTap(e) {
    this.setData({ activeTab: e.currentTarget.dataset.id })
    this.loadResources()
  },

  onSearchConfirm(e) {
    const keyword = e.detail.value
    if (keyword.trim()) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
      })
    }
  },

  onGoVip() {
    wx.switchTab({ url: '/pages/vip/vip' })
  },

  onResourceTap(e) {
    const item = this.data.resourceList.find(r => r._id === e.currentTarget.dataset.id) || {}
    
    if (item._id && item._id.indexOf('more-') === -1) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + item._id
      })
    } else {
      const data = {
        title: item.title || '资源标题',
        date: item.time || '2026-05-03',
        isVip: item.vip,
        views: Math.floor(Math.random() * 999) + 100,
        cover: ''
      }
      wx.navigateTo({
        url: '/pages/detail/detail?data=' + encodeURIComponent(JSON.stringify(data))
      })
    }
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    if (this.data.searchValue.trim()) return
    
    this.setData({ loading: true })

    const moreFreeTitles = [
      '微信自动回复工具',
      '批量图片压缩工具',
      'PDF转Word工具',
      '批量改名工具',
      '批量下载图片工具',
      '批量加水印工具'
    ]

    setTimeout(() => {
      const more = []
      const current = this.data.resourceList.length
      for (let i = 0; i < 3; i++) {
        const titleIndex = (current + i) % moreFreeTitles.length
        more.push({
          _id: `more-${Date.now()}-${i}`,
          title: moreFreeTitles[titleIndex],
          desc: '实用工具，免费分享，小白也能快速上手！',
          tag: '亲测好用',
          time: '刚刚',
          price: 0,
          vip: false,
          hot: false,
          cover: '📁',
          tabType: 'free'
        })
      }
      this.setData({
        resourceList: [...this.data.resourceList, ...more],
        page: this.data.page + 1,
        hasMore: this.data.page < 3,
        loading: false
      })
    }, 600)
  }
})
