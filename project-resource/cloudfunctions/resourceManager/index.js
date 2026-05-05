const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'list':
        return await listResources(data)
      case 'detail':
        return await getResourceDetail(data)
      case 'add':
        return await addResource(data)
      case 'update':
        return await updateResource(data)
      case 'delete':
        return await deleteResource(data)
      case 'batchAdd':
        return await batchAddResources(data)
      case 'stats':
        return await getResourceStats(data)
      default:
        return { success: false, message: '未知操作' }
    }
  } catch (err) {
    console.error('操作失败:', err)
    return { success: false, message: err.message }
  }
}

async function listResources(data) {
  const { page = 1, pageSize = 20, category, subCategory, tabType, keyword } = data
  const skip = (page - 1) * pageSize
  
  let query = {}
  
  if (category && category !== 'all') {
    query.categoryId = category
  }
  
  if (subCategory) {
    query.subCategoryId = subCategory
  }
  
  if (tabType === 'hot') {
    query.hot = true
  } else if (tabType === 'new') {
    query.tabType = 'new'
  } else if (tabType === 'free') {
    _.or([{ price: 0 }, { price: null }, { isFree: true }])
  }
  
  if (keyword) {
    query = _.and([
      query,
      _.or([
        { title: db.RegExp({ regexp: keyword, options: 'i' }) },
        { desc: db.RegExp({ regexp: keyword, options: 'i' }) },
        { tag: db.RegExp({ regexp: keyword, options: 'i' }) }
      ])
    ])
  }

  const countResult = await db.collection('resources').where(query).count()
  const total = countResult.total
  
  const listResult = await db.collection('resources')
    .where(query)
    .orderBy('createdAt', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    success: true,
    list: listResult.data.map(item => ({
      _id: item._id,
      title: item.title,
      desc: item.desc || '',
      tag: item.tag || '',
      time: formatTime(item.createdAt),
      price: item.price || 0,
      vip: item.isVip || false,
      hot: item.hot || false,
      cover: item.cover || '📁',
      categoryId: item.categoryId || '',
      subCategoryId: item.subCategoryId || '',
      views: item.views || 0,
      isFree: item.price === 0 || item.isFree,
      tabType: item.tabType || ''
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}

async function getResourceDetail(data) {
  const { id } = data
  
  if (!id) {
    return { success: false, message: '缺少资源ID' }
  }

  const res = await db.collection('resources').doc(id).get()
  
  if (!res.data) {
    return { success: false, message: '资源不存在' }
  }

  const item = res.data
  
  await db.collection('resources').doc(id).update({
    data: { views: (item.views || 0) + 1 }
  })

  return {
    success: true,
    resource: {
      _id: item._id,
      title: item.title,
      desc: item.desc || '',
      detail: item.detail || generateDefaultDetail(item.title),
      features: item.features || [],
      audience: item.audience || [],
      benefits: item.benefits || [],
      downloadLink: item.downloadLink || '',
      price: item.price || 0,
      originalPrice: item.originalPrice || 0,
      isVip: item.isVip || false,
      isFree: item.price === 0 || item.isFree,
      tag: item.tag || '',
      categoryId: item.categoryId || '',
      subCategoryId: item.subCategoryId || '',
      views: (item.views || 0) + 1,
      date: formatTime(item.createdAt),
      coverBg: item.coverBg || '#f3f4f6',
      coverText: item.cover || '📁'
    }
  }
}

async function addResource(data) {
  const { title, desc, detail, price, originalPrice, isVip, isFree, hot, 
          categoryId, subCategory, tag, cover, coverBg, 
          features, audience, benefits, downloadLink, tabType } = data
  
  if (!title) {
    return { success: false, message: '资源标题不能为空' }
  }

  const result = await db.collection('resources').add({
    data: {
      title,
      desc: desc || '',
      detail: detail || '',
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || 0,
      isVip: !!isVip,
      isFree: !!isFree || (!isVip && (!price || price == 0)),
      hot: !!hot,
      categoryId: categoryId || '',
      subCategoryId: subCategory || '',
      tag: tag || '',
      cover: cover || '📁',
      coverBg: coverBg || '#f3f4f6',
      features: features || [],
      audience: audience || [],
      benefits: benefits || [],
      downloadLink: downloadLink || '',
      tabType: tabType || 'hot',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return { success: true, message: '添加成功', id: result._id }
}

async function updateResource(data) {
  const { id, ...updateData } = data
  
  if (!id) {
    return { success: false, message: '缺少资源ID' }
  }

  updateData.updatedAt = new Date()
  
  if (updateData.price !== undefined) {
    updateData.price = parseFloat(updateData.price) || 0
    updateData.isFree = !updateData.isVip && (!updateData.price || updateData.price == 0)
  }

  await db.collection('resources').doc(id).update({
    data: updateData
  })

  return { success: true, message: '更新成功' }
}

async function deleteResource(data) {
  const { id } = data
  
  if (!id) {
    return { success: false, message: '缺少资源ID' }
  }

  await db.collection('resources').doc(id).remove()
  
  return { success: true, message: '删除成功' }
}

async function batchAddResources(data) {
  const { resources } = data
  
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    return { success: false, message: '资源列表不能为空' }
  }

  const now = new Date()
  let successCount = 0
  let failCount = 0

  for (const res of resources) {
    try {
      await db.collection('resources').add({
        data: {
          title: res.title || '未命名资源',
          desc: res.desc || res.description || '',
          detail: res.detail || '',
          price: parseFloat(res.price) || 0,
          originalPrice: parseFloat(res.originalPrice) || 0,
          isVip: !!res.isVip || !!res.vip,
          isFree: !res.isVip && !res.vip && (!res.price || res.price == 0),
          hot: !!res.hot,
          categoryId: res.categoryId || res.category || '',
          subCategoryId: res.subCategoryId || res.subCategory || '',
          tag: res.tag || '',
          cover: res.cover || '📁',
          coverBg: res.coverBg || '#f3f4f6',
          features: res.features || [],
          audience: res.audience || [],
          benefits: res.benefits || [],
          downloadLink: res.downloadLink || res.link || '',
          tabType: res.tabType || 'hot',
          views: 0,
          createdAt: now,
          updatedAt: now
        }
      })
      successCount++
    } catch (err) {
      console.error('批量添加失败:', res.title, err)
      failCount++
    }
  }

  return {
    success: true,
    message: `批量完成：成功 ${successCount} 条，失败 ${failCount} 条`,
    successCount,
    failCount
  }
}

async function getResourceStats() {
  const totalRes = await db.collection('resources').count()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  
  const todayRes = await db.collection('resources')
    .where({ createdAt: _.gte(todayStart) })
    .count()
    
  const vipRes = await db.collection('resources')
    .where({ isVip: true })
    .count()
    
  const freeRes = await db.collection('resources')
    .where(_.or([{ price: 0 }, { price: null }, { isFree: true }]))
    .count()

  return {
    success: true,
    stats: {
      total: totalRes.total || 0,
      today: todayRes.total || 0,
      vip: vipRes.total || 0,
      free: freeRes.total || 0
    }
  }
}

function formatTime(date) {
  if (!date) return '刚刚'
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function generateDefaultDetail(title) {
  return `本站精选优质资源「${title}」，内容丰富详实，包含理论讲解和实操演示，适合各类学习者。\n\n课程特点：\n✅ 系统化教学体系\n✅ 实战案例丰富\n✅ 配套资料齐全\n✅ 售后答疑解惑\n\n学习收获：\n• 掌握核心技能\n• 了解行业趋势\n• 积累实战经验\n• 拓展人脉资源`
}
