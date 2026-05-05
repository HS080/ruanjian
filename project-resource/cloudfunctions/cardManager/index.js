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
        return await listCards(data)
      case 'delete':
        return await deleteCard(data)
      case 'stats':
        return await getStats()
      default:
        return { success: false, message: '未知操作' }
    }
  } catch (err) {
    console.error('操作失败:', err)
    return { success: false, message: err.message }
  }
}

async function listCards(data) {
  const { page = 1, pageSize = 20, status = 'all', keyword = '' } = data
  const skip = (page - 1) * pageSize
  
  let query = {}
  
  if (status === 'unused') {
    query.used = false
  } else if (status === 'used') {
    query.used = true
  }
  
  if (keyword) {
    query.key = db.RegExp({
      regexp: keyword,
      options: 'i'
    })
  }

  const countResult = await db.collection('cardKeys').where(query).count()
  const total = countResult.total
  
  const listResult = await db.collection('cardKeys')
    .where(query)
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    success: true,
    list: listResult.data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

async function deleteCard(data) {
  const { id } = data
  if (!id) {
    return { success: false, message: '缺少卡密ID' }
  }
  
  await db.collection('cardKeys').doc(id).remove()
  return { success: true, message: '删除成功' }
}

async function getStats() {
  const totalResult = await db.collection('cardKeys').count()
  const unusedResult = await db.collection('cardKeys').where({ used: false }).count()
  const usedResult = await db.collection('cardKeys').where({ used: true }).count()
  
  return {
    success: true,
    stats: {
      total: totalResult.total,
      unused: unusedResult.total,
      used: usedResult.total
    }
  }
}
