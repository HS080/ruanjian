const app = getApp()

const ADMIN_USER_ID = '505783'

Page({
  data: {
    isAdmin: false,
    currentTab: 'generate',
    
    // 统计
    stats: null,
    
    // 生成相关
    count: 10,
    durationOptions: ['30天 - 月度会员', '90天 - 季度会员', '180天 - 半年会员', '365天 - 年度会员', '永久 - 终身会员'],
    durationValues: [30, 90, 180, 365, 99999],
    durationIndex: 3,
    lengthOptions: ['8位字符', '10位字符（推荐）', '12位字符', '16位字符'],
    lengthValues: [8, 10, 12, 16],
    lengthIndex: 1,
    generating: false,
    generated: false,
    genSuccess: false,
    errorMsg: '',
    newCards: [],
    
    // 卡密列表
    loading: false,
    cardList: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    keyword: '',
    statusFilter: 'all',
    
    // 用户管理
    userLoading: false,
    userList: [],
    userTotal: 0,
    userPage: 1,
    userTotalPages: 1,
    userPageSize: 10,
    userKeyword: '',
    userFilter: 'all',
    userStats: null,

    // 资源管理
    resLoading: false,
    resList: [],
    resTotal: 0,
    resPage: 1,
    resTotalPages: 1,
    resPageSize: 10,
    resKeyword: '',
    resFilter: 'all',
    resStats: null,
    
    // 添加/编辑资源弹窗
    showResourceModal: false,
    editingResourceId: null,
    saving: false,
    formData: {
      title: '',
      desc: '',
      detail: '',
      price: '',
      originalPrice: '',
      tag: '',
      cover: '',
      downloadLink: '',
      featuresStr: '',
      isVip: true,
      hot: false
    },
    
    // 批量导入弹窗
    showBatchModal: false,
    batchJson: '',
    batchPreviewCount: 0,
    batchImporting: false
  },

  onLoad() {
    const userId = wx.getStorageSync('user_id') || ''
    console.log('当前用户ID:', userId, '管理员ID:', ADMIN_USER_ID)
    
    if (userId === ADMIN_USER_ID) {
      this.setData({ isAdmin: true })
      this.loadStats()
      this.loadUsers()
    } else {
      this.setData({ isAdmin: false })
      wx.showToast({ title: '无权访问管理后台', icon: 'none', duration: 2000 })
    }
  },

  onShow() {
    if (this.data.isAdmin) {
      if (this.data.currentTab === 'cards') {
        this.loadCards()
      } else if (this.data.currentTab === 'users') {
        this.loadUsers()
        this.loadUserStats()
      }
    }
  },

  // ========== Tab切换 ==========
  switchTab(e) {
    if (!this.data.isAdmin) return
    
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    
    if (tab === 'cards') {
      this.loadCards()
    } else if (tab === 'users') {
      this.loadUsers()
      this.loadUserStats()
    }
  },

  // ========== 统计 ==========
  async loadStats() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'cardManager',
        data: { action: 'stats' }
      })
      if (res.result && res.result.success) {
        this.setData({ stats: res.result.stats })
      }
    } catch (e) {
      console.error('加载统计失败:', e)
    }
  },

  async loadUserStats() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'userManager',
        data: { action: 'stats' }
      })
      if (res.result && res.result.success) {
        this.setData({ userStats: res.result.stats })
      }
    } catch (e) {
      console.error('加载用户统计失败:', e)
    }
  },

  // ========== 生成卡密 ==========
  onCountInput(e) {
    if (!this.data.isAdmin) return
    let val = parseInt(e.detail.value) || 1
    if (val < 1) val = 1
    if (val > 100) val = 100
    this.setData({ count: val })
  },

  onDurationChange(e) { this.setData({ durationIndex: parseInt(e.detail.value) }) },
  onLengthChange(e) { this.setData({ lengthIndex: parseInt(e.detail.value) }) },

  async onGenerate() {
    if (!this.data.isAdmin) { wx.showToast({ title: '无权限操作', icon: 'none' }); return }
    
    const { count, durationValues, durationIndex } = this.data
    if (count < 1 || count > 100) { wx.showToast({ title: '数量需在1-100之间', icon: 'none' }); return }

    this.setData({ generating: true, generated: false })

    try {
      const res = await wx.cloud.callFunction({
        name: 'generateCards',
        data: { count, duration: durationValues[durationIndex] }
      })

      if (res.result && res.result.success) {
        this.setData({
          generating: false, generated: true, genSuccess: true,
          newCards: res.result.cards || []
        })
        wx.showToast({ title: `成功生成${res.result.cards.length}张`, icon: 'success' })
        this.loadStats()
      } else {
        throw new Error(res.result ? res.result.message : '生成失败')
      }
    } catch (err) {
      this.setData({ generating: false, generated: true, genSuccess: false, errorMsg: err.message || '生成失败' })
      wx.showToast({ title: err.message || '生成失败', icon: 'none' })
    }
  },

  onCopyCard(e) { wx.setClipboardData({ data: e.currentTarget.dataset.key }) },
  onCopyAllNew() {
    const { newCards } = this.data
    if (newCards.length > 0) wx.setClipboardData({ data: newCards.join('\n') })
  },
  onResetGenerate() { this.setData({ generated: false, genSuccess: false, errorMsg: '', newCards: [] }) },

  // ========== 管理卡密 ==========
  onSearchInput(e) { this.setData({ keyword: e.detail.value }) },
  onSearch() { this.setData({ currentPage: 1 }); this.loadCards() },
  onFilterStatus(e) { this.setData({ statusFilter: e.currentTarget.dataset.status, currentPage: 1 }); this.loadCards() },

  async loadCards() {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'cardManager',
        data: {
          action: 'list',
          data: { page: this.data.currentPage, pageSize: this.data.pageSize, status: this.data.statusFilter, keyword: this.data.keyword }
        }
      })

      if (res.result && res.result.success) {
        this.setData({
          cardList: res.result.list || [], total: res.result.total || 0,
          totalPages: res.result.totalPages || 1, loading: false
        })
      } else {
        throw new Error(res.result ? res.result.message : '查询失败')
      }
    } catch (err) {
      console.error('加载卡密失败:', err)
      this.setData({ loading: false, cardList: [] })
      wx.showToast({ title: err.message || '加载失败', icon: 'none' })
    }
  },

  prevPage() { if (this.data.currentPage <= 1) return; this.setData({ currentPage: this.data.currentPage - 1 }); this.loadCards() },
  nextPage() { if (this.data.currentPage >= this.data.totalPages) return; this.setData({ currentPage: this.data.currentPage + 1 }); this.loadCards() },

  onDeleteCard(e) {
    if (!this.data.isAdmin) { wx.showToast({ title: '无权限操作', icon: 'none' }); return }
    const { id, key } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除', content: `确定要删除卡密 ${key} 吗？此操作不可恢复！`,
      confirmText: '删除', confirmColor: '#ef4444',
      success: (res) => { if (res.confirm) this.doDeleteCard(id) }
    })
  },

  async doDeleteCard(id) {
    try {
      const res = await wx.cloud.callFunction({ name: 'cardManager', data: { action: 'delete', data: { id } } })
      if (res.result && res.result.success) {
        wx.showToast({ title: '删除成功', icon: 'success' })
        this.loadCards(); this.loadStats()
      } else {
        throw new Error(res.result ? res.result.message : '删除失败')
      }
    } catch (err) { wx.showToast({ title: err.message || '删除失败', icon: 'none' }) }
  },

  // ========== 用户管理 ==========
  onUserSearchInput(e) { this.setUserDebounceData({ userKeyword: e.detail.value }) },
  
  setUserDebounceData(data) { this.setData(data) },
  
  onUserSearch() { this.setData({ userPage: 1 }); this.loadUsers() },
  
  onUserFilter(e) { this.setData({ userFilter: e.currentTarget.dataset.filter, userPage: 1 }); this.loadUsers() },

  async loadUsers() {
    this.setData({ userLoading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'userManager',
        data: {
          action: 'list',
          data: {
            page: this.data.userPage,
            pageSize: this.data.userPageSize,
            filter: this.data.userFilter,
            keyword: this.data.userKeyword
          }
        }
      })

      if (res.result && res.result.success) {
        const list = (res.result.list || []).map(user => ({
          ...user,
          vipExpireDate: user.vipExpireTime ? new Date(user.vipExpireTime).toLocaleString() : '-'
        }))
        
        this.setData({
          userList: list,
          userTotal: res.result.total || 0,
          userTotalPages: res.result.totalPages || 1,
          userLoading: false
        })
      } else {
        throw new Error(res.result ? res.result.message : '查询失败')
      }
    } catch (err) {
      console.error('加载用户失败:', err)
      this.setData({ userLoading: false, userList: [] })
      wx.showToast({ title: err.message || '加载用户失败', icon: 'none' })
    }
  },

  prevUserPage() { if (this.data.userPage <= 1) return; this.setData({ userPage: this.data.userPage - 1 }); this.loadUsers() },
  nextUserPage() { if (this.data.userPage >= this.data.userTotalPages) return; this.setData({ userPage: this.data.userPage + 1 }); this.loadUsers() },

  onViewUserDetail(e) {
    const userId = e.currentTarget.dataset.userid
    wx.showModal({
      title: '用户详情',
      content: `用户ID: ${userId}\n\n可在此处查看更多用户信息`,
      showCancel: false
    })
  },

  onRevokeVip(e) {
    if (!this.data.isAdmin) { wx.showToast({ title: '无权限操作', icon: 'none' }); return }
    const { userid, nickname } = e.currentTarget.dataset
    
    wx.showModal({
      title: '取消VIP',
      content: `确定要取消用户「${nickname || userid}」的VIP身份吗？`,
      confirmText: '取消VIP',
      confirmColor: '#f59e0b',
      success: (res) => {
        if (res.confirm) this.doRevokeVip(userid, nickname)
      }
    })
  },

  async doRevokeVip(userId, nickname) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'userManager',
        data: { action: 'revokeVip', data: { userId } }
      })

      if (res.result && res.result.success) {
        wx.showToast({ title: `已取消 ${nickname || userId} 的VIP`, icon: 'success' })
        this.loadUsers()
        this.loadUserStats()
      } else {
        throw new Error(res.result ? res.result.message : '操作失败')
      }
    } catch (err) {
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  },

  // ========== 资源管理 ==========
  
  onShow() {
    if (this.data.isAdmin) {
      if (this.data.currentTab === 'cards') {
        this.loadCards()
      } else if (this.data.currentTab === 'users') {
        this.loadUsers()
        this.loadUserStats()
      } else if (this.data.currentTab === 'resources') {
        this.loadResources()
        this.loadResStats()
      } else {
        this.loadStats()
      }
    }
  },

  loadResStats() {
    wx.cloud.callFunction({
      name: 'resourceManager',
      data: { action: 'stats' }
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({ resStats: res.result.stats })
      }
    }).catch(e => console.error('加载资源统计失败:', e))
  },

  async loadResources() {
    this.setData({ resLoading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'resourceManager',
        data: {
          action: 'list',
          data: {
            page: this.data.resPage,
            pageSize: this.data.resPageSize,
            keyword: this.data.resKeyword,
            filter: this.data.resFilter
          }
        }
      })

      if (res.result && res.result.success) {
        this.setData({
          resList: res.result.list || [],
          resTotal: res.result.total || 0,
          resTotalPages: res.result.totalPages || 1,
          resLoading: false
        })
      } else {
        throw new Error(res.result ? res.result.message : '查询失败')
      }
    } catch (err) {
      console.error('加载资源失败:', err)
      this.setData({ resLoading: false, resList: [] })
    }
  },

  onResSearchInput(e) { this.setData({ resKeyword: e.detail.value }) },
  onResSearch() { this.setData({ resPage: 1 }); this.loadResources() },
  onResFilter(e) { this.setData({ resFilter: e.currentTarget.dataset.filter, resPage: 1 }); this.loadResources() },
  
  prevResPage() { if (this.data.resPage <= 1) return; this.setData({ resPage: this.data.resPage - 1 }); this.loadResources() },
  nextResPage() { if (this.data.resPage >= this.data.resTotalPages) return; this.setData({ resPage: this.data.resPage + 1 }); this.loadResources() },

  showAddResource() {
    this.setData({
      showResourceModal: true,
      editingResourceId: null,
      formData: {
        title: '', desc: '', detail: '',
        price: '', originalPrice: '', tag: '', cover: '📁',
        downloadLink: '', featuresStr: '', isVip: true, hot: false
      }
    })
  },

  async onEditResource(e) {
    const id = e.currentTarget.dataset.id
    try {
      const res = await wx.cloud.callFunction({
        name: 'resourceManager',
        data: { action: 'detail', data: { id } }
      })

      if (res.result && res.result.success) {
        const item = res.result.resource
        this.setData({
          showResourceModal: true,
          editingResourceId: id,
          formData: {
            title: item.title || '',
            desc: item.desc || '',
            detail: item.detail || '',
            price: String(item.price || ''),
            originalPrice: String(item.originalPrice || ''),
            tag: item.tag || '',
            cover: item.cover || '📁',
            downloadLink: item.downloadLink || '',
            featuresStr: (item.features || []).join('\n'),
            isVip: !!item.isVip,
            hot: !!item.hot
          }
        })
      }
    } catch (err) {
      wx.showToast({ title: '加载资源详情失败', icon: 'none' })
    }
  },

  closeResourceModal() { this.setData({ showResourceModal: false }) },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`formData.${field}`]: e.detail.value })
  },

  onSwitchChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`formData.${field}`]: e.detail.value })
  },

  async saveResource() {
    const { formData, editingResourceId } = this.data
    
    if (!formData.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' }); return
    }

    this.setData({ saving: true })

    try {
      const features = formData.featuresStr ? formData.featuresStr.split('\n').filter(s => s.trim()) : []
      
      const data = {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        detail: formData.detail.trim(),
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        isVip: formData.isVip,
        hot: formData.hot,
        tag: formData.tag.trim(),
        cover: formData.cover || '📁',
        downloadLink: formData.downloadLink.trim(),
        features: features
      }

      let res
      if (editingResourceId) {
        res = await wx.cloud.callFunction({
          name: 'resourceManager',
          data: { action: 'update', data: { id: editingResourceId, ...data } }
        })
      } else {
        res = await wx.cloud.callFunction({
          name: 'resourceManager',
          data: { action: 'add', data }
        })
      }

      if (res.result && res.result.success) {
        wx.showToast({ title: editingResourceId ? '更新成功' : '添加成功', icon: 'success' })
        this.closeResourceModal()
        this.loadResources()
        this.loadResStats()
      } else {
        throw new Error(res.result ? res.result.message : '操作失败')
      }
    } catch (err) {
      wx.showToast({ title: err.message || '保存失败', icon: 'none' })
    }

    this.setData({ saving: false })
  },

  onDeleteResource(e) {
    const { id, title } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${title}」吗？此操作不可恢复！`,
      confirmText: '删除',
      confirmColor: '#ef4444',
      success: (res) => { if (res.confirm) this.doDeleteResource(id) }
    })
  },

  async doDeleteResource(id) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'resourceManager',
        data: { action: 'delete', data: { id } }
      })
      if (res.result && res.result.success) {
        wx.showToast({ title: '删除成功', icon: 'success' })
        this.loadResources()
        this.loadResStats()
      }
    } catch (err) {
      wx.showToast({ title: err.message || '删除失败', icon: 'none' })
    }
  },

  // ========== 批量导入 ==========
  
  showBatchImport() {
    this.setData({ showBatchModal: true, batchJson: '', batchPreviewCount: 0 })
  },

  closeBatchModal() { this.setData({ showBatchModal: false }) },

  onBatchJsonInput(e) {
    const json = e.detail.value
    this.setData({ batchJson: json })
    
    try {
      const arr = JSON.parse(json)
      this.setData({ batchPreviewCount: Array.isArray(arr) ? arr.length : 0 })
    } catch (err) {
      this.setData({ batchPreviewCount: 0 })
    }
  },

  async doBatchImport() {
    let resources
    try {
      resources = JSON.parse(this.data.batchJson)
      if (!Array.isArray(resources) || resources.length === 0) {
        throw new Error('JSON格式错误，需要数组')
      }
    } catch (err) {
      wx.showToast({ title: 'JSON格式错误', icon: 'none' }); return
    }

    this.setData({ batchImporting: true })

    try {
      const res = await wx.cloud.callFunction({
        name: 'resourceManager',
        data: { action: 'batchAdd', data: { resources } }
      })

      if (res.result && res.result.success) {
        wx.showToast({ 
          title: res.result.message, 
          icon: 'success',
          duration: 3000
        })
        this.closeBatchModal()
        this.loadResources()
        this.loadResStats()
      } else {
        throw new Error(res.result ? res.result.message : '导入失败')
      }
    } catch (err) {
      wx.showToast({ title: err.message || '导入失败', icon: 'none' })
    }

    this.setData({ batchImporting: false })
  }
})
