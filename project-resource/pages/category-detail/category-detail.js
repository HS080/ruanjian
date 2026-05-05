const app = getApp()

const categoryData = {
  ai: {
    name: 'AI风口',
    subs: [
      { id: 'ai-all', name: 'AI风口' },
      { id: 'ai-writing', name: 'AI写作' },
      { id: 'ai-image', name: 'AI绘画' },
      { id: 'ai-video', name: 'AI视频' },
      { id: 'ai-audio', name: 'AI音频' }
    ]
  },
  project: {
    name: '实战项目',
    subs: [
      { id: 'project-all', name: '实战项目' },
      { id: 'wangchuang', name: '网创项目' },
      { id: 'offline', name: '线下项目' },
      { id: 'cross-border', name: '跨境项目' }
    ]
  },
  tool: {
    name: '免费工具',
    subs: [
      { id: 'tool-all', name: '免费工具' },
      { id: 'efficiency', name: '效率工具' },
      { id: 'design', name: '设计工具' },
      { id: 'marketing', name: '营销工具' }
    ]
  },
  promote: {
    name: '引流推广',
    subs: [
      { id: 'promote-all', name: '引流推广' },
      { id: 'traffic', name: '流量获取' },
      { id: 'seo', name: 'SEO优化' },
      { id: 'ads', name: '广告投放' }
    ]
  },
  ecommerce: {
    name: '电商运营',
    subs: [
      { id: 'ecommerce-all', name: '电商运营' },
      { id: 'taobao', name: '淘宝' },
      { id: 'jd', name: '京东' },
      { id: 'pdd', name: '拼多多' },
      { id: 'douyin-shop', name: '抖音小店' }
    ]
  },
  copywriting: {
    name: '文案写作',
    subs: [
      { id: 'copywriting-all', name: '文案写作' },
      { id: 'article', name: '文章写作' },
      { id: 'script', name: '脚本撰写' },
      { id: 'ad-copy', name: '广告文案' }
    ]
  },
  media: {
    name: '自媒体',
    subs: [
      { id: 'media-all', name: '自媒体' },
      { id: 'public-account', name: '公众号' },
      { id: 'xiaohongshu', name: '小红书' },
      { id: 'toutiao', name: '头条号' }
    ]
  },
  community: {
    name: '社群营销',
    subs: [
      { id: 'community-all', name: '社群营销' },
      { id: 'wechat-group', name: '微信群' },
      { id: 'qq-group', name: 'QQ群' },
      { id: 'knowledge-pay', name: '知识付费' }
    ]
  },
  shortvideo: {
    name: '短视频',
    subs: [
      { id: 'shortvideo-all', name: '短视频' },
      { id: 'douyin', name: '抖音' },
      { id: 'kuaishou', name: '快手' },
      { id: 'video-number', name: '视频号' }
    ]
  },
  more: {
    name: '全部分类',
    subs: [
      { id: 'more-all', name: '全部分类' }
    ]
  }
}

const mainCategories = [
  { id: 'ai', name: '网创专区' },
  { id: 'platform', name: '各大平台' },
  { id: 'tool-lib', name: '工具库' }
]

const allSubCategories = [
  { id: 'ai', name: 'AI风口' },
  { id: 'project', name: '实战项目' },
  { id: 'tool', name: '免费工具' },
  { id: 'promote', name: '引流推广' },
  { id: 'ecommerce', name: '电商运营' },
  { id: 'copywriting', name: '文案写作' },
  { id: 'media', name: '自媒体' },
  { id: 'community', name: '社群营销' },
  { id: 'shortvideo', name: '短视频' },
  { id: 'more', name: '全部分类' }
]

const allResources = [
  {
    _id: '1',
    title: '稀缺赛道王炸组合！AI数字人讲师+商业思维月变现10w+',
    desc: 'AI数字人课程，商业思维教学，月入十万实战分享',
    isVip: true,
    views: 194,
    date: '2026-05-02',
    coverBg: '#fef3c7',
    coverText: '🎯',
    categoryId: 'ai',
    subCategoryId: 'ai-all'
  },
  {
    _id: '2',
    title: '2026年视频号赛道，最新AI民间故事，每日10分钟',
    desc: '视频号AI民间故事玩法，新手快速上手指南',
    isVip: true,
    views: 640,
    date: '2026-04-30',
    coverBg: '#dbeafe',
    coverText: '🎬',
    categoryId: 'ai',
    subCategoryId: 'ai-video'
  },
  {
    _id: '3',
    title: '豆包+剪映，制作爆款AI唱歌MV，新手轻松上手',
    desc: 'AI唱歌MV制作教程，豆包剪映结合使用技巧',
    isVip: true,
    views: 551,
    date: '2026-04-29',
    coverBg: '#fef08a',
    coverText: '🎵',
    categoryId: 'ai',
    subCategoryId: 'ai-video'
  },
  {
    _id: '4',
    title: 'AI制作翻页书单号，每天半小时，收益破三张',
    desc: '翻页书单号制作教程，AI工具辅助内容创作',
    isVip: true,
    views: 1530,
    date: '2026-03-27',
    coverBg: '#dcfce7',
    coverText: '📚',
    hot: true,
    hotText: '30分钟',
    categoryId: 'ai',
    subCategoryId: 'ai-all'
  },
  {
    _id: '5',
    title: 'AI制作微缩景观，小人国视频制作，一天可变现2000+',
    desc: '微缩景观小人国视频制作，变现方式详解',
    isVip: true,
    views: 1219,
    date: '2026-03-25',
    coverBg: '#fee2e2',
    coverText: '🏰',
    categoryId: 'ai',
    subCategoryId: 'ai-video'
  },
  {
    _id: '6',
    title: '懒人福音！靠DeepSeek做养生餐视频，播放破100w赚1000+',
    desc: 'DeepSeek养生餐视频教程，百万播放变现方法',
    isVip: true,
    views: 784,
    date: '2026-03-24',
    coverBg: '#fef3c7',
    coverText: '🍳',
    categoryId: 'ai',
    subCategoryId: 'ai-writing'
  },
  {
    _id: '7',
    title: 'AI一键生成短剧脚本，含配套工具，快速上手',
    desc: 'AI短剧脚本生成工具，实战项目教程',
    isVip: false,
    views: 892,
    date: '2026-03-23',
    coverBg: '#e0e7ff',
    coverText: '🎭',
    categoryId: 'project',
    subCategoryId: 'project-all'
  },
  {
    _id: '8',
    title: '抖音7W粉干货教学，从0到1快速涨粉变现',
    desc: '抖音涨粉变现教程，7万粉丝经验分享',
    isVip: true,
    views: 1456,
    date: '2026-03-22',
    coverBg: '#fce7f3',
    coverText: '📱',
    categoryId: 'shortvideo',
    subCategoryId: 'douyin'
  },
  {
    _id: '9',
    title: '小红书笔记速成课，从0到1打造爆款笔记',
    desc: '小红书运营教程，爆款笔记写作技巧',
    isVip: true,
    views: 892,
    date: '2026-03-21',
    coverBg: '#fce7f3',
    coverText: '📖',
    categoryId: 'media',
    subCategoryId: 'xiaohongshu'
  },
  {
    _id: '10',
    title: '闲鱼电商最新实战课程，无货源模式月入过万',
    desc: '闲鱼无货源电商教程，实战项目经验分享',
    isVip: true,
    views: 1234,
    date: '2026-03-20',
    coverBg: '#fef3c7',
    coverText: '🐟',
    categoryId: 'ecommerce',
    subCategoryId: 'pdd'
  },
  {
    _id: '11',
    title: '拼多多虚拟电商，高利润虚拟产品玩法',
    desc: '拼多多虚拟电商教程，虚拟产品选品策略',
    isVip: true,
    views: 756,
    date: '2026-03-19',
    coverBg: '#dbeafe',
    coverText: '🎁',
    categoryId: 'ecommerce',
    subCategoryId: 'pdd'
  },
  {
    _id: '12',
    title: '微信群引流变现全攻略，日引500+精准粉',
    desc: '微信群引流教程，精准粉丝获取方法',
    isVip: true,
    views: 1023,
    date: '2026-03-18',
    coverBg: '#dcfce7',
    coverText: '💬',
    categoryId: 'community',
    subCategoryId: 'wechat-group'
  },
  {
    _id: '13',
    title: 'TikTok Shop跨境电商运营课，从0到1做跨境',
    desc: 'TikTok跨境电商教程，海外市场拓展策略',
    isVip: true,
    views: 645,
    date: '2026-03-17',
    coverBg: '#fee2e2',
    coverText: '🌍',
    categoryId: 'ecommerce',
    subCategoryId: 'douyin-shop'
  },
  {
    _id: '14',
    title: 'SEO搜索引擎优化课，让你的网站排名首页',
    desc: 'SEO优化教程，搜索引擎排名提升技巧',
    isVip: true,
    views: 534,
    date: '2026-03-16',
    coverBg: '#fef3c7',
    coverText: '🔍',
    categoryId: 'promote',
    subCategoryId: 'seo'
  },
  {
    _id: '15',
    title: 'AI自媒体写作教程，智能体创建方法合集',
    desc: 'AI写作教程，智能体应用技巧自媒体人必备',
    isVip: true,
    views: 1123,
    date: '2026-03-15',
    coverBg: '#e0e7ff',
    coverText: '📝',
    categoryId: 'copywriting',
    subCategoryId: 'article'
  },
  {
    _id: '16',
    title: '年入百万路径规划课，从0到1实现财务自由',
    desc: '年入百万路径规划，财务自由实战分享',
    isVip: true,
    views: 2341,
    date: '2026-03-14',
    coverBg: '#fef3c7',
    coverText: '💰',
    categoryId: 'project',
    subCategoryId: 'wangchuang'
  }
]

function searchResources(keyword, categoryId, subId) {
  let results = allResources
  
  if (categoryId && categoryId !== 'ai') {
    if (categoryId === 'platform') {
      results = results.filter(r => ['shortvideo', 'media'].includes(r.categoryId))
    } else if (categoryId === 'tool-lib') {
      results = results.filter(r => r.categoryId === 'tool')
    }
  }
  
  if (subId && subId !== 'ai-all' && subId !== 'project-all' && subId !== 'tool-all' && 
      subId !== 'promote-all' && subId !== 'ecommerce-all' && subId !== 'copywriting-all' && 
      subId !== 'media-all' && subId !== 'community-all' && subId !== 'shortvideo-all' && 
      subId !== 'more-all') {
    results = results.filter(r => r.subCategoryId === subId || r.categoryId === subId)
  }
  
  if (keyword && keyword.trim()) {
    const kw = keyword.toLowerCase().trim()
    results = results.filter(item => 
      item.title.toLowerCase().includes(kw) ||
      item.desc.toLowerCase().includes(kw)
    )
  }
  
  return results
}

Page({
  data: {
    statusBarHeight: 0,
    pageTitle: '',
    categoryId: '',
    categoryName: '',
    searchValue: '',
    
    showCategoryFilter: false,
    showSubFilter: false,
    
    categoryList: mainCategories,
    selectedCategoryId: 'ai',
    selectedCategoryName: '网创专区',
    
    subCategoryList: allSubCategories,
    selectedSubId: 'ai',
    selectedSubName: 'AI风口',
    
    resourceList: [],
    loading: false,
    hasMore: true,
    page: 1
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })
    
    const categoryId = options.categoryId || 'ai'
    const categoryName = decodeURIComponent(options.categoryName || 'AI风口')
    
    let initialSubId = categoryId
    let initialSubName = categoryName
    
    if (!allSubCategories.find(s => s.id === categoryId)) {
      initialSubId = 'ai'
      initialSubName = 'AI风口'
    }
    
    this.setData({
      categoryId,
      pageTitle: categoryName,
      categoryName,
      selectedCategoryId: 'ai',
      selectedCategoryName: '网创专区',
      selectedSubId: initialSubId,
      selectedSubName: initialSubName
    })
    
    this.loadResources()
  },

  goBack() {
    wx.navigateBack()
  },

  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value })
  },

  onSearchConfirm() {
    this.setData({ page: 1, resourceList: [] })
    this.loadResources()
  },

  clearSearch() {
    this.setData({ searchValue: '', page: 1, resourceList: [] })
    this.loadResources()
  },

  toggleCategoryFilter() {
    this.setData({
      showCategoryFilter: !this.data.showCategoryFilter,
      showSubFilter: false
    })
  },

  toggleSubFilter() {
    this.setData({
      showSubFilter: !this.data.showSubFilter,
      showCategoryFilter: false
    })
  },

  closeFilters() {
    this.setData({
      showCategoryFilter: false,
      showSubFilter: false
    })
  },

  selectCategory(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({
      selectedCategoryId: id,
      selectedCategoryName: name,
      showCategoryFilter: false,
      page: 1,
      resourceList: []
    })
    
    this.loadResources()
  },

  selectSub(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({
      selectedSubId: id,
      selectedSubName: name,
      showSubFilter: false,
      page: 1,
      resourceList: []
    })
    this.loadResources()
  },

  loadResources() {
    this.setData({ loading: true })
    
    setTimeout(() => {
      const resources = searchResources(
        this.data.searchValue,
        this.data.selectedCategoryId,
        this.data.selectedSubId
      )
      
      this.setData({
        resourceList: resources,
        loading: false,
        page: 2,
        hasMore: resources.length >= 8
      })
    }, 300)
  },

  onReachBottom() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ loading: true })
    
    setTimeout(() => {
      const moreResources = []
      for (let i = 0; i < 4; i++) {
        moreResources.push({
          _id: `more-${Date.now()}-${i}`,
          title: `${this.data.selectedSubName} 更多精品资源 ${i + 1}，持续更新中...`,
          desc: '优质资源持续更新中，欢迎查看',
          isVip: Math.random() > 0.3,
          views: Math.floor(Math.random() * 1000) + 100,
          date: '2026-' + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
          coverBg: ['#fef3c7', '#dbeafe', '#dcfce7', '#fee2e2'][i],
          coverText: ['💡', '🚀', '⭐', '🔥'][i],
          categoryId: this.data.selectedSubId,
          subCategoryId: this.data.selectedSubId + '-' + i
        })
      }
      
      this.setData({
        resourceList: [...this.data.resourceList, ...moreResources],
        loading: false,
        page: this.data.page + 1,
        hasMore: this.data.resourceList.length < 20
      })
    }, 500)
  },

  onResourceTap(e) {
    const item = this.data.resourceList.find(r => r._id === e.currentTarget.dataset.id)
    if (item) {
      const data = {
        title: item.title,
        date: item.date,
        isVip: item.isVip,
        views: item.views,
        cover: ''
      }
      wx.navigateTo({
        url: '/pages/detail/detail?data=' + encodeURIComponent(JSON.stringify(data))
      })
    }
  }
})
