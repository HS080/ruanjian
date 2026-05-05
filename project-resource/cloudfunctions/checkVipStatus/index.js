const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { userId, openid } = event
  
  try {
    if (!userId && !openid) {
      return { success: false, message: '缺少用户标识' }
    }

    const now = Date.now()
    
    const isNewFormat = userId && userId.match(/^\d{6}$/)
    
    let query
    if (isNewFormat) {
      query = { used: true, userId: userId }
    } else {
      query = { used: true, usedBy: openid || userId }
    }

    const userCards = await db.collection('cardKeys')
      .where(query)
      .get()

    let isVip = false
    let latestExpireTime = null

    for (const card of userCards.data) {
      let expireTime = card.vipExpireTime
      
      if (!expireTime && card.duration && card.usedTime) {
        const usedDate = new Date(card.usedTime)
        expireTime = new Date(usedDate.getTime() + (card.duration || 30) * 24 * 60 * 60 * 1000).getTime()
      }

      if (expireTime && expireTime > now) {
        isVip = true
        if (!latestExpireTime || expireTime > latestExpireTime) {
          latestExpireTime = expireTime
        }
      }
    }

    return {
      success: true,
      isVip: isVip,
      vipExpireTime: latestExpireTime,
      totalCards: userCards.data.length
    }
  } catch (err) {
    console.error('查询VIP状态失败:', err)
    return { success: false, message: err.message, isVip: false }
  }
}
