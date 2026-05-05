const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'list':
        return await listUsers(data)
      case 'stats':
        return await getUserStats()
      case 'revokeVip':
        return await revokeVip(data)
      default:
        return { success: false, message: '未知操作' }
    }
  } catch (err) {
    console.error('操作失败:', err)
    return { success: false, message: err.message }
  }
}

async function listUsers(data) {
  const { page = 1, pageSize = 20, filter = 'all', keyword = '' } = data
  const skip = (page - 1) * pageSize
  const now = Date.now()
  
  let query = { used: true }

  const countResult = await db.collection('cardKeys').where(query).count()
  const total = countResult.total
  
  const listResult = await db.collection('cardKeys')
    .where(query)
    .orderBy('usedTime', 'desc')
    .skip(skip)
    .limit(pageSize * 3)
    .get()

  const userList = []
  const seenUsers = new Set()

  for (const card of listResult.data) {
    const uid = card.userId || ''
    const displayId = uid || card.usedBy || '未知'
    
    if (!seenUsers.has(displayId)) {
      seenUsers.add(displayId)

      const userQuery = uid 
        ? { used: true, userId: uid }
        : { used: true, usedBy: card.usedBy }

      const userCardsRes = await db.collection('cardKeys').where(userQuery).count()

      const allUserCards = await db.collection('cardKeys')
        .where(userQuery)
        .field({ vipExpireTime: true, duration: true, usedTime: true, points: true, friends: true })
        .get()

      let isVip = false
      let latestExpireTime = null
      let latestPoints = 0
      let latestFriends = 0

      for (const c of allUserCards.data) {
        let expireTime = c.vipExpireTime
        
        if (!expireTime && c.duration && c.usedTime) {
          const usedDate = new Date(c.usedTime)
          expireTime = new Date(usedDate.getTime() + (c.duration || 30) * 24 * 60 * 60 * 1000).getTime()
        }

        if (expireTime && expireTime > now) {
          isVip = true
          if (!latestExpireTime || expireTime > latestExpireTime) {
            latestExpireTime = expireTime
          }
        }

        if (c.points !== undefined && c.points !== null && c.points > latestPoints) {
          latestPoints = c.points
        }
        if (c.friends !== undefined && c.friends !== null && c.friends > latestFriends) {
          latestFriends = c.friends
        }
      }

      if (filter === 'vip' && !isVip) continue
      if (filter === 'normal' && isVip) continue

      if (keyword) {
        const nick = card.nickname || displayId
        if (!nick.toLowerCase().includes(keyword.toLowerCase()) && 
            !displayId.toLowerCase().includes(keyword.toLowerCase())) {
          continue
        }
      }

      const latestCard = allUserCards.data.sort((a, b) => 
        new Date(b.usedTime || b._updatedAt) - new Date(a.usedTime || a._updatedAt)
      )[0]

      userList.push({
        userId: displayId,
        nickname: card.nickname || displayId,
        isVip: isVip,
        vipExpireTime: latestExpireTime,
        totalCards: userCardsRes.total,
        points: latestPoints,
        friends: latestFriends,
        registerTime: latestCard ? (latestCard.usedTime || latestCard._updatedAt) : null
      })

      if (userList.length >= pageSize) break
    }
  }

  return {
    success: true,
    list: userList,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

async function getUserStats() {
  const now = Date.now()
  
  const allUsersRes = await db.collection('cardKeys')
    .where({ used: true })
    .field({ userId: true, usedBy: true, duration: true, usedTime: true, vipExpireTime: true })
    .get()

  const userMap = new Map()
  
  for (const c of allUsersRes.data) {
    const uid = c.userId || c.usedBy
    if (!uid) continue
    
    if (!userMap.has(uid)) {
      userMap.set(uid, { isVip: false })
    }
    
    let expireTime = c.vipExpireTime
    if (!expireTime && c.duration && c.usedTime) {
      const usedDate = new Date(c.usedTime)
      expireTime = new Date(usedDate.getTime() + (c.duration || 30) * 24 * 60 * 60 * 1000).getTime()
    }
    
    if (expireTime && expireTime > now) {
      userMap.get(uid).isVip = true
    }
  }

  let total = userMap.size
  let vipCount = 0
  userMap.forEach(v => { if (v.isVip) vipCount++ })

  return {
    success: true,
    stats: {
      total: total || 0,
      vipCount: vipCount || 0,
      normalCount: Math.max(0, (total || 0) - (vipCount || 0))
    }
  }
}

async function revokeVip(data) {
  const { userId } = data
  if (!userId) {
    return { success: false, message: '缺少用户ID' }
  }

  const now = Date.now()
  
  const isNewFormat = userId.match(/^\d{6}$/)
  const baseQuery = isNewFormat 
    ? { used: true, userId: userId }
    : { used: true, usedBy: userId }

  const allUserCards = await db.collection('cardKeys')
    .where(baseQuery)
    .get()

  let updatedCount = 0

  for (const card of allUserCards.data) {
    let shouldRevoke = false
    
    if (card.vipExpireTime && card.vipExpireTime > now) {
      shouldRevoke = true
    } else if (!card.vipExpireTime && card.duration && card.usedTime) {
      const usedDate = new Date(card.usedTime)
      const calcExpire = new Date(usedDate.getTime() + (card.duration || 30) * 24 * 60 * 60 * 1000).getTime()
      if (calcExpire > now) {
        shouldRevoke = true
      }
    }

    if (shouldRevoke) {
      await db.collection('cardKeys').doc(card._id).update({
        data: {
          vipExpireTime: now,
          revokedAt: new Date(),
          revokedBy: 'admin'
        }
      })
      updatedCount++
    }
  }

  return {
    success: true,
    message: updatedCount > 0 
      ? `VIP已取消，影响 ${updatedCount} 条卡密记录` 
      : '该用户当前没有有效的VIP状态'
  }
}
