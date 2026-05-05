const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

function generateCardKey(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

exports.main = async (event, context) => {
  const { count = 10, duration = 30 } = event
  
  if (count > 100) {
    return { success: false, message: '单次最多生成100张' }
  }

  const cards = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const key = generateCardKey()
    cards.push({
      key,
      duration,
      used: false,
      createTime: now,
      usedTime: null,
      usedBy: null
    })
  }

  try {
    for (const card of cards) {
      await db.collection('cardKeys').add({
        data: card
      })
    }

    return {
      success: true,
      message: `成功生成 ${count} 张卡密`,
      cards: cards.map(c => c.key),
      duration
    }
  } catch (err) {
    console.error('生成卡密失败:', err)
    return { success: false, message: '生成失败: ' + err.message }
  }
}
