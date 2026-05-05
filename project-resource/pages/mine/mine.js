const app = getApp()

const nicknames = [
  "小明", "小红", "小李", "小王", "小张",
  "阿杰", "小美", "阿伟", "小花", "阿强",
  "小雨", "晴天", "梦想家", "追梦者", "行动派",
  "奋斗者", "开拓者", "创造者", "探险家", "旅行家",
  "小助手", "小天才", "小达人", "小能手", "小专家",
  "开心果", "努力的", "勤奋的", "勇敢的", "聪明的"
]

function generateRandomNickname() {
  const prefix = nicknames[Math.floor(Math.random() * nicknames.length)]
  const suffix = Math.floor(Math.random() * 9999)
  return prefix + suffix
}

function generateRandomId() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

Page({
  data: {
    nickname: "",
    userId: "",
    points: 0,
    friends: 0,
    isVip: false,
    vipLevel: "",
    statusBarHeight: 0,
    todaySigned: false,
    taskList: [
      { id: "1", name: "每日签到", points: 1, icon: "📅", done: false, isSign: true },
      { id: "2", name: "邀请好友", points: 3, icon: "👥", done: false, isShareButton: true }
    ],
    menuList: [
      {
        group: "服务",
        items: [
          { id: "vip", name: "加入会员", icon: "👑", arrow: true, color: "#f59e0b" },
          { id: "contact", name: "联系客服", icon: "💬", arrow: true, color: "#6366f1" }
        ]
      },
      {
        group: "更多",
        items: [
          { id: "about", name: "关于我们", icon: "ℹ️", arrow: true, color: "#22c55e" },
          { id: "subscribe", name: "关注公众号", icon: "📢", arrow: true, color: "#ef4444" },
          { id: "substation", name: "开通分站", icon: "🏪", arrow: true, color: "#8b5cf6" }
        ]
      }
    ],
    showImageModal: false,
    imageModalTitle: '',
    imageModalTip: ''
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight || 20
    this.setData({ statusBarHeight })

    let nickname = wx.getStorageSync("user_nickname")
    let userId = wx.getStorageSync("user_id")
    let points = wx.getStorageSync("user_points")
    let friends = wx.getStorageSync("user_friends")
    let todaySigned = wx.getStorageSync("today_signed")
    let today = new Date().toDateString()
    let lastSignDate = wx.getStorageSync("last_sign_date")
    let hasCard = wx.getStorageSync("user_has_card") || false
    const vipExpireTime = wx.getStorageSync("vip_expire_time") || 0
    const now = Date.now()
    const revokedDate = new Date("2026-05-03T00:00:00").getTime()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000

    if (vipExpireTime > now) {
      const expireDate = new Date(vipExpireTime)
      const expectedExpireForInvalidCard = new Date(revokedDate + thirtyDays)
      const dayDiff = Math.abs((expireDate - expectedExpireForInvalidCard) / (24 * 60 * 60 * 1000))

      if (dayDiff <= 1) {
        wx.setStorageSync("user_has_card", false)
        wx.setStorageSync("vip_expire_time", 0)
        hasCard = false
        wx.showToast({
          title: "您的会员已被废除",
          icon: "none",
          duration: 3000
        })
      } else {
        hasCard = true
      }
    } else if (vipExpireTime > 0) {
      hasCard = false
      wx.setStorageSync("user_has_card", false)
    }

    let basePoints = wx.getStorageSync("daily_base_points")
    if (!basePoints || basePoints.date !== today) {
      basePoints = { date: today, points: points }
      wx.setStorageSync("daily_base_points", basePoints)
    }

    const dailyIncrease = points - basePoints.points
    if (!hasCard && dailyIncrease > 5) {
      const excessPoints = dailyIncrease - 5
      const newPoints = points - excessPoints
      wx.setStorageSync("user_points", newPoints)
      points = newPoints
      wx.showToast({
        title: "检测到异常操作，已收回" + excessPoints + "积分",
        icon: "none",
        duration: 3000
      })
      this.syncStatsToCloud(newPoints, friends)
    }

    if (lastSignDate !== today) {
      todaySigned = false
      wx.setStorageSync("today_signed", false)
      wx.setStorageSync("last_sign_date", "")
    }

    if (!nickname) {
      nickname = generateRandomNickname()
      wx.setStorageSync("user_nickname", nickname)
    }
    if (!userId) {
      userId = generateRandomId()
      wx.setStorageSync("user_id", userId)
    }
    if (points === "" || points === null || points === undefined) {
      points = 3
      wx.setStorageSync("user_points", points)
    }
    if (friends === "" || friends === null || friends === undefined) {
      friends = 0
      wx.setStorageSync("user_friends", friends)
    }

    this.setData({
      nickname,
      userId,
      points,
      friends,
      isVip: hasCard,
      todaySigned: todaySigned || false,
      "taskList[0].done": todaySigned || false
    })

    wx.showShareMenu({
      withShareTicket: true
    })

    this.syncVipFromCloud(userId)
  },

  syncVipFromCloud(userId) {
    const localVipExpire = wx.getStorageSync("vip_expire_time") || 0
    const localHasCard = wx.getStorageSync("user_has_card") || false
    
    wx.cloud.callFunction({
      name: 'checkVipStatus',
      data: {
        userId: userId,
        openid: app.globalData.openid || wx.getStorageSync("openid") || ""
      }
    }).then(res => {
      if (res.result && res.result.success) {
        const cloudIsVip = res.result.isVip
        const cloudExpireTime = res.result.vipExpireTime || 0
        
        const localIsVip = localHasCard && localVipExpire > Date.now()
        
        if (cloudIsVip !== localIsVip) {
          if (cloudIsVip) {
            wx.setStorageSync("user_has_card", true)
            if (cloudExpireTime > 0) {
              wx.setStorageSync("vip_expire_time", cloudExpireTime)
            }
            this.setData({ isVip: true })
          } else {
            wx.setStorageSync("user_has_card", false)
            wx.setStorageSync("vip_expire_time", 0)
            this.setData({ isVip: false })
            
            if (localIsVip && !cloudIsVip) {
              wx.showToast({
                title: "您的VIP已被管理员取消",
                icon: "none",
                duration: 3000
              })
            }
          }
          
          app.globalData.isVip = cloudIsVip
        }
      }
    }).catch(err => {
      console.error('同步VIP状态失败:', err)
    })
  },

  syncStatsToCloud(points, friends) {
    const userId = this.data.userId || wx.getStorageSync("user_id") || ""
    wx.cloud.callFunction({
      name: 'updateUserStats',
      data: {
        userId: userId,
        openid: app.globalData.openid || wx.getStorageSync("openid") || "",
        points: points,
        friends: friends
      }
    }).catch(err => {
      console.error('同步积分好友失败:', err)
    })
  },

  onSign() {
    if (this.data.todaySigned) {
      wx.showToast({ title: "今日已签到", icon: "none" })
      return
    }

    const today = new Date().toDateString()
    wx.setStorageSync("today_signed", true)
    wx.setStorageSync("last_sign_date", today)

    const newPoints = this.data.points + 1
    wx.setStorageSync("user_points", newPoints)

    this.setData({
      points: newPoints,
      todaySigned: true,
      "taskList[0].done": true
    })

    wx.showToast({ title: "签到成功！+1积分", icon: "success" })
    this.syncStatsToCloud(newPoints, this.data.friends)
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log('来自页面内转发按钮')
    }
    return {
      title: "项目资源站 - 全网最热门的网创资源平台",
      path: "pages/index/index?inviterId=" + this.data.userId,
      imageUrl: ""
    }
  },

  onShareTimeline() {
    return {
      title: "项目资源站 - 全网最热门的网创资源平台"
    }
  },

  onAppShow(options) {
    if (options.query && options.query.inviterId) {
      const inviterId = options.query.inviterId
      if (inviterId !== this.data.userId) {
        let inviteRecords = wx.getStorageSync('invite_records') || []
        const today = new Date().toDateString()
        const todayRecords = inviteRecords.filter(r => r.date === today)
        if (todayRecords.length === 0) {
          wx.showToast({
            title: '有人通过你的分享进入了小程序',
            icon: 'none',
            duration: 2000
          })
        }
        inviteRecords.push({
          inviterId: inviterId,
          date: today,
          time: Date.now()
        })
        wx.setStorageSync('invite_records', inviteRecords)
        const todayInvites = inviteRecords.filter(r => r.date === today).length
        const basePoints = 3
        let totalBonus = 0
        for (let i = 0; i < todayInvites; i++) {
          totalBonus += basePoints
        }
        const maxDailyBonus = 30
        totalBonus = Math.min(totalBonus, maxDailyBonus)
        if (todayInvites <= 10 && totalBonus > 0) {
          const newPoints = this.data.points + totalBonus
          const newFriends = this.data.friends + 1
          wx.setStorageSync('user_points', newPoints)
          wx.setStorageSync('user_friends', newFriends)
          this.setData({
            points: newPoints,
            friends: newFriends,
            "taskList[1].done": true
          })
          wx.showToast({
            title: '邀请成功！+' + totalBonus + '积分',
            icon: 'success'
          })
          this.syncStatsToCloud(newPoints, newFriends)
        }
      }
    }
  },

  onTaskTap(e) {
    const { id } = e.currentTarget.dataset
    const task = this.data.taskList.find(t => t.id === id)
    if (!task) return

    if (task.isSign) {
      this.onSign()
    }
  },

  onMenuTap(e) {
    const { id } = e.currentTarget.dataset
    switch (id) {
      case "vip":
        wx.switchTab({ url: "/pages/vip/vip" })
        break
      case "contact":
        this.showImageModal('联系客服', '长按识别二维码添加客服微信')
        break
      case "about":
        this.showAboutModal()
        break
      case "subscribe":
        this.showImageModal('关注公众号', '长按识别二维码关注公众号')
        break
      case "substation":
        this.showSubstationModal()
        break
    }
  },

  showImageModal(title, tip) {
    this.setData({
      showImageModal: true,
      imageModalTitle: title,
      imageModalTip: tip
    })
  },

  closeImageModal() {
    this.setData({
      showImageModal: false
    })
  },

  showAboutModal() {
    this.setData({
      showAboutModal: true
    })
  },

  closeAboutModal() {
    this.setData({
      showAboutModal: false
    })
  },

  showSubstationModal() {
    this.setData({
      showSubstationModal: true
    })
  },

  closeSubstationModal() {
    this.setData({
      showSubstationModal: false
    })
  },

  onSubstationContact() {
    this.setData({
      showSubstationModal: false,
      showImageModal: true,
      imageModalTitle: '联系客服',
      imageModalTip: '长按识别二维码添加客服微信'
    })
  },

  goToAdmin() {
    wx.navigateTo({ url: '/pages/admin/admin' })
  }
})