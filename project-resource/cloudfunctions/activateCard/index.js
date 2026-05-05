const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { cardKey, openid, userId } = event
  
  try {
    const res = await db.collection('cardKeys')
      .where({ key: cardKey, used: false })
      .get()
    
    if (res.data.length === 0) {
      return { success: false, message: '卡密无效或已被使用' }
    }
    
    const card = res.data[0]
    const now = new Date()
    const vipExpireTime = new Date(now.getTime() + (card.duration || 30) * 24 * 60 * 60 * 1000)
    
    await db.collection('cardKeys').doc(card._id).update({
      data: { 
        used: true, 
        usedTime: now, 
        usedBy: openid,
        userId: userId || '',
        nickname: event.nickname || '',
        points: event.points || 0,
        friends: event.friends || 0,
        vipExpireTime: vipExpireTime.getTime()
      }
    })
    
    return { 
      success: true, 
      duration: card.duration || 30,
      message: '激活成功'
    }
  } catch (err) {
    console.error('激活失败:', err)
    return { success: false, message: '激活失败' }
  }
}
