const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { userId, openid, points, friends } = event
  
  try {
    if (!userId && !openid) {
      return { success: false, message: '缺少用户标识' }
    }

    const isNewFormat = userId && userId.match(/^\d{6}$/)
    
    let query
    if (isNewFormat) {
      query = { used: true, userId: userId }
    } else {
      query = { used: true, usedBy: openid || userId }
    }

    const updateData = {}
    if (points !== undefined && points !== null) {
      updateData.points = points
    }
    if (friends !== undefined && friends !== null) {
      updateData.friends = friends
    }

    const result = await db.collection('cardKeys')
      .where(query)
      .update({
        data: updateData
      })

    return {
      success: true,
      message: `已更新 ${result.stats.updated} 条记录`,
      updated: result.stats.updated
    }
  } catch (err) {
    console.error('更新用户数据失败:', err)
    return { success: false, message: err.message }
  }
}
