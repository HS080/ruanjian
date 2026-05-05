App({
  onLaunch() {
    this.globalData.cloudReady = false
    if (!wx.cloud) {
      console.warn("请使用 2.2.3 或以上的基础库以使用云能力")
      return
    }
    try {
      wx.cloud.init({
        env: "cloud1-d2gh0liegda761092",
        traceUser: true
      })
      this.globalData.cloudReady = true

      wx.cloud.callFunction({
        name: 'login',
        data: {}
      }).then(res => {
        if (res.result && res.result.openid) {
          this.globalData.openid = res.result.openid
          wx.setStorageSync("openid", res.result.openid)
          console.log("openid 获取成功:", res.result.openid)
        }
      }).catch(err => {
        console.error("获取openid失败:", err)
      })
    } catch (e) {
      console.warn("云开发初始化失败，将使用本地模拟数据", e)
    }
  },

  getDb() {
    if (!this.globalData.cloudReady) return null
    try {
      return wx.cloud.database()
    } catch (e) {
      return null
    }
  },

  globalData: {
    userInfo: null,
    openid: null,
    isVip: false,
    vipLevel: 0,
    points: 1280,
    friends: 36,
    cloudReady: false
  }
})
