const app = getApp()

function getDb() {
  return app.getDb()
}

Page({
  data: {
    statusBarHeight: 0,
    vipList: [],
    showModal: false,
    currentVip: {},
    cardKey: "",
    activating: false,
    showImageModal: false,
    imageModalTitle: '',
    imageModalTip: ''
  },

  onLoad() {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })
    this.loadVipList()
  },

  loadVipList() {
    const list = [
      {
        _id: "month",
        name: "月份会员",
        price: 39.9,
        originalPrice: 39.9,
        duration: "30天",
        desc: "适合短期使用，畅享全部资源",
        features: ["全部资源免费下载", "专属资源优先体验", "VIP专属标识"],
        color: "#6366f1",
        icon: "📅"
      },
      {
        _id: "year",
        name: "年份会员",
        price: 199,
        originalPrice: 478.8,
        duration: "365天",
        desc: "年度最佳性价比，每天不到6毛钱",
        features: ["全部资源免费下载", "专属资源优先体验", "VIP专属标识", "赠送500积分", "专属客服通道"],
        color: "#f59e0b",
        icon: "👑",
        recommend: true
      },
      {
        _id: "lifetime",
        name: "终身会员",
        price: 399,
        originalPrice: 999,
        duration: "永久",
        desc: "一次付费，永久使用，超值之选",
        features: ["全部资源免费下载", "专属资源优先体验", "VIP专属标识", "赠送2000积分", "专属客服通道", "资源定制服务"],
        color: "#ef4444",
        icon: "💎"
      },
      {
        _id: "agent",
        name: "代理会员",
        price: 999,
        originalPrice: 1999,
        duration: "永久",
        desc: "享受代理分佣，开启赚钱模式",
        features: ["终身会员所有权益", "独立推广链接", "50%分佣比例", "专属代理后台", "优先资源对接", "技术扶持"],
        color: "#8b5cf6",
        icon: "🚀"
      }
    ]
    list.forEach(item => {
      if (item.originalPrice > 0) {
        const discount = item.price / item.originalPrice * 10
        item.discount = discount.toFixed(1)
      } else {
        item.discount = "1.0"
      }
    })
    this.setData({ vipList: list })
  },

  onBuyTap(e) {
    const { item } = e.currentTarget.dataset
    this.setData({
      showModal: true,
      currentVip: item,
      cardKey: ""
    })
  },

  onCardKeyInput(e) {
    this.setData({ cardKey: e.detail.value })
  },

  closeModal() {
    this.setData({ showModal: false, cardKey: "" })
  },

  onActivate() {
    const { cardKey, activating } = this.data
    if (activating) return
    if (!cardKey.trim()) {
      wx.showToast({ title: "请输入卡密", icon: "none" })
      return
    }

    this.setData({ activating: true })

    const inputKey = cardKey.trim()
    console.log("正在验证卡密:", inputKey)

    const invalidKeys = ["hsghl147369"]

    if (invalidKeys.includes(inputKey)) {
      wx.setStorageSync("activated_by_invalid_card", true)
      wx.setStorageSync("user_has_card", false)
      wx.setStorageSync("vip_expire_time", 0)
      wx.showToast({ title: "该卡密已被废除", icon: "none" })
      this.setData({ activating: false })
      return
    }

    const db = getDb()
    console.log("数据库连接状态:", db ? "成功" : "失败")

    if (db) {
      wx.cloud.callFunction({
        name: 'activateCard',
        data: {
          cardKey: inputKey,
          openid: app.globalData.openid || wx.getStorageSync("openid") || "unknown",
          userId: wx.getStorageSync("user_id") || "",
          nickname: wx.getStorageSync("user_nickname") || "",
          points: wx.getStorageSync("user_points") || 0,
          friends: wx.getStorageSync("user_friends") || 0
        }
      }).then(res => {
        console.log("云函数返回:", res.result)
        
        if (res.result && res.result.success) {
          const vipDuration = res.result.duration || 30
          const now = new Date()
          const expireTime = new Date(now.getTime() + vipDuration * 24 * 60 * 60 * 1000)

          console.log("激活VIP，时长:", vipDuration, "天")
          console.log("到期时间:", expireTime)

          wx.setStorageSync("user_has_card", true)
          wx.setStorageSync("vip_expire_time", expireTime.getTime())
          wx.setStorageSync("vip_duration_days", vipDuration)

          console.log("激活成功！")
          wx.showToast({ title: "激活成功！获得会员权益", icon: "success" })
          this.setData({ showModal: false, cardKey: "", activating: false })
          app.globalData.isVip = true
          this.refreshMinePage()
        } else {
          console.log("卡密无效或已被使用:", res.result ? res.result.message : "未知错误")
          wx.showToast({ title: res.result ? res.result.message : "卡密无效或已被使用", icon: "none" })
          this.setData({ activating: false })
        }
      }).catch(err => {
        console.error("激活出错:", err)
        this.setData({ activating: false })
        wx.showToast({ title: "激活失败，请重试", icon: "none" })
      })
    } else {
      console.log("数据库未连接")
      wx.showToast({ title: "系统初始化中，请稍后", icon: "none" })
      setTimeout(() => {
        this.setData({ activating: false })
      }, 2000)
    }
  },

  preventBubble() {},

  refreshMinePage() {
    const pages = getCurrentPages()
    const minePage = pages.find(p => p.route === "pages/mine/mine")
    if (minePage) {
      const vipExpireTime = wx.getStorageSync("vip_expire_time") || 0
      const now = Date.now()
      const isVip = vipExpireTime > now
      minePage.setData({ isVip: isVip })
    }
  },

  onContactService() {
    this.showImageModal('联系客服', '长按识别二维码添加客服微信')
  },

  showImageModal(title, tip) {
    this.setData({
      showImageModal: true,
      imageModalTitle: title,
      imageModalTip: tip
    })
  },

  closeImageModal() {
    this.setData({ showImageModal: false })
  },

  onRuleTap() {
    wx.showModal({
      title: "VIP权益说明",
      content: "1. 购买卡密后请在VIP页面输入激活\n2. 卡密一经激活，不支持退款\n3. 每种会员时长不同，请根据需求选择\n4. 代理会员享有推广分佣权益",
      showCancel: false,
      confirmText: "我知道了",
      confirmColor: "#f59e0b"
    })
  }
})
