Page({
  data: {
    resource: {},
    statusBarHeight: 0,
    showImageModal: false,
    imageModalTitle: '',
    imageModalTip: '',
    showLinkModal: false,
    downloadLink: 'https://example.com/download/resource'
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })

    if (options.id) {
      this.loadFromCloud(options.id)
    } else if (options.data) {
      this.loadFromLocal(options.data)
    } else {
      this.loadDefault()
    }
  },

  loadFromCloud(id) {
    wx.showLoading({ title: '加载中...' })
    
    wx.cloud.callFunction({
      name: 'resourceManager',
      data: { action: 'detail', data: { id } }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result && res.result.success && res.result.resource) {
        const item = res.result.resource
        
        item.detail = item.detail || this.generateDetail(item.title)
        item.features = item.features.length > 0 ? item.features : this.generateFeatures(item.title)
        item.audience = item.audience.length > 0 ? item.audience : this.generateAudience(item.title)
        item.benefits = item.benefits.length > 0 ? item.benefits : this.generateBenefits(item.title)
        
        this.setData({
          resource: item,
          downloadLink: item.downloadLink || ''
        })
        
        wx.setNavigationBarTitle({ title: item.title })
      } else {
        this.loadDefault()
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('从云端加载失败:', err)
      this.loadDefault()
    })
  },

  loadFromLocal(dataStr) {
    try {
      const item = JSON.parse(decodeURIComponent(dataStr))
      item.detail = this.generateDetail(item.title)
      item.features = this.generateFeatures(item.title)
      item.audience = this.generateAudience(item.title)
      item.benefits = this.generateBenefits(item.title)
      this.setData({ resource: item, downloadLink: '' })
    } catch (e) {
      this.loadDefault()
    }
  },

  loadDefault() {
    const item = {
      title: '精选资源',
      date: '2026-05-03',
      isVip: true,
      views: 999
    }
    item.detail = this.generateDetail(item.title)
    item.features = this.generateFeatures(item.title)
    item.audience = this.generateAudience(item.title)
    item.benefits = this.generateBenefits(item.title)
    this.setData({ resource: item, downloadLink: '' })
  },

  generateDetail(title) {
    const templates = [
      {
        keywords: ['AI', '一键生成', '短剧'],
        text: '本课程将带你深入了解AI短剧生成的核心技术，从脚本创作到视频制作全流程讲解。\n\n课程内容涵盖：\n1. AI短剧市场分析与前景\n2. 短剧脚本撰写技巧与模板\n3. 主流AI工具使用教程\n4. 视频后期处理技巧\n5. 短剧变现模式解析\n6. 实操案例演示\n\n通过本课程的学习，你将掌握完整的AI短剧制作流程，能够独立产出高质量短剧内容！'
      },
      {
        keywords: ['抖音', '粉', '干货'],
        text: '这是一套系统化的抖音运营实战课程，从账号搭建到粉丝变现的全套方法论。\n\n课程大纲：\n1. 抖音算法机制深度解析\n2. 账号定位与人设打造\n3. 爆款选题与文案技巧\n4. 拍摄剪辑实操教学\n5. 直播带货入门指南\n6. 粉丝增长策略\n7. 变现路径规划\n8. 数据分析与优化\n\n无论你是新手还是有一定基础的创作者，都能从中获得实用的涨粉和变现方法！'
      },
      {
        keywords: ['年入', '路径', '百万'],
        text: '年入百万不是梦！本课程为你揭秘互联网赚钱的核心逻辑和实操方法。\n\n课程亮点：\n✅ 揭秘2026年最新赚钱风口\n✅ 从0到1的完整变现路径\n✅ 多种被动收入模式\n✅ 低成本创业实战\n✅ 风险控制与避坑指南\n\n你将学到：\n- 如何找到适合自己的赚钱赛道\n- 打造个人IP的完整流程\n- 产品设计与定价策略\n- 流量获取的底层逻辑\n- 用户转化的关键技巧\n- 团队组建与管理方法\n\n适合所有想通过互联网实现财务自由的人士！'
      },
      {
        keywords: ['全域', '矩阵', '流量'],
        text: '全域流量矩阵是当前最有效的获客方式之一，本课程带你构建属于自己的流量帝国！\n\n核心内容：\n📱 多平台账号矩阵搭建\n📊 各平台算法差异分析\n🎯 内容分发策略制定\n💰 跨平台引流技巧\n📈 数据监控与分析\n🔥 热点追踪与借势\n\n课程特色：\n• 理论+实操结合\n• 真实案例分析\n• 工具推荐与使用\n• 一对一问题解答\n\n学完即可落地执行，快速实现流量翻倍！'
      },
      {
        keywords: ['跨境', 'TikTok', 'shop'],
        text: 'TikTok跨境电商是当前最火热的出海赛道，本课程手把手教你做TikTok shop！\n\n课程模块：\n🌍 TikTok生态概览\n🛒 Shop开店全流程\n📦 选品策略与供应链\n📝 商品上架优化\n🎬 内容营销与引流\n💬 客户服务与售后\n📊 店铺数据分析\n🚀 规模化运营技巧\n\n你将获得：\n• 完整的开店SOP手册\n• 爆款选品清单\n• 高转化话术模板\n• 免费工具资源包\n• 学员专属交流群\n\n0基础也能学会，助你开启跨境电商新事业！'
      },
      {
        keywords: ['社群', '爆粉', '技术'],
        text: '社群运营+自动爆粉，这套组合拳让你轻松获取精准用户！\n\n课程精华：\n💡 社群定位与顶层设计\n👥 引流裂变玩法\n🤖 自动化工具配置\n💬 社群活跃度提升\n💎 付费转化技巧\n📊 KPI指标体系\n\n实战技能：\n✓ 微信群/QQ群运营\n✓ 公众号私域沉淀\n✓ 企业微信自动化\n✓ 知识星球运营\n✓ 朋友圈营销技巧\n\n包含大量真实案例和数据，让你少走弯路，快速上手！'
      },
      {
        keywords: ['ai自媒体', '智能体', '写作'],
        text: 'AI时代已经到来，用AI工具做自媒体，效率提升10倍以上！\n\n课程体系：\n🤖 AI写作工具大测评\n📝 文章自动生成技巧\n🎨 AI绘图工具应用\n🎬 AI视频制作教程\n📊 数据分析自动化\n🔄 工作流整合方案\n\n你能学到：\n• ChatGPT/GPT-4高级用法\n• Midjourney/Stable Diffusion\n• AI辅助选题策划\n• 批量内容生产\n• SEO优化技巧\n• 变现渠道拓展\n\n告别加班熬夜，AI帮你搞定80%的工作！'
      },
      {
        keywords: ['国内电商', '高端运营', '合集'],
        text: '国内电商竞争激烈？这套高端运营合集让你脱颖而出！\n\n覆盖平台：\n🏪 淘宝/天猫运营\n⚡ 京东运营\n📦 拼多多运营\n🐟 闲鱼运营\n🎵 抖音小店\n📲 快手电商\n\n核心课程：\n▶️ 店铺基础设置\n▶️ 产品策划与包装\n▶️ 直通车/引力魔方\n▶️ 内容种草策略\n▶️ 直播带货实战\n▶️ 客服转化技巧\n▶️ 数据分析复盘\n▶️ 品牌打造路径\n\n价值万元以上的运营知识，一次打包带走！'
      },
      {
        keywords: ['短视频', '带货', '实战'],
        text: '短视频带货是当前门槛最低、回报最高的副业选择！\n\n课程安排：\nDay 1: 平台规则与账号定位\nDay 2: 爆款选题方法论\nDay 3: 手机拍摄技巧\nDay 4: 剪辑软件实操\nDay 5: 文案脚本撰写\nDay 6: 上架与发布\nDay 7: 数据优化\nDay 8: 直播带货入门\nDay 9: 团队复制\nDay 10: 变现升级\n\n配套资料：\n📋 100个爆款脚本模板\n🎵 无版权音乐库\n📸 拍摄道具清单\n💰 选品表格模板\n\n跟着做就能出结果，已帮助1000+学员成功起号！'
      },
      {
        keywords: ['互联网', '铁饭碗', 'AI代写'],
        text: 'AI代写是2026年最稳定的副业之一，一台电脑就能月入过万！\n\n为什么选择AI代写？\n✅ 时间自由，随时随地工作\n✅ 收入稳定，按件计费\n✅ 需求旺盛，客户源源不断\n✅ 技术简单，几天就能上手\n\n课程内容：\n📝 代写类型介绍（文章、论文、文案、剧本等）\n🤖 AI工具使用大全\n✍️ 写作质量把控\n💼 接单渠道汇总\n📞 客户沟通技巧\n⏰ 项目管理方法\n💰 定价策略指导\n\n提供接单资源对接，学完直接开始赚钱！'
      },
      {
        keywords: ['闲鱼', '电商', '最新'],
        text: '闲鱼无货源模式，零成本开店，日赚300+不是梦！\n\n课程优势：\n🎯 0库存风险\n💰 启动资金低\n⏰ 操作时间灵活\n📈 复购率高\n\n详细教程：\n1. 闲鱼账号养号技巧\n2. 选品上架全流程\n3. 标题主图优化\n4. 客服话术模板\n5. 发货打包规范\n6. 违规避坑指南\n7. 多店运营策略\n8. 进阶玩法分享\n\n附带：爆款产品清单、定价表、ERP工具推荐等实用资料！'
      },
      {
        keywords: ['拼多多', '虚拟', '电商'],
        text: '拼多多虚拟产品是高利润、低风险的电商蓝海！\n\n为什么做虚拟产品？\n💎 利润率高达90%+\n📦 无需物流发货\n🔄 可无限复制销售\n👥 刚需市场需求大\n\n课程涵盖：\n📂 虚拟产品类型分析\n🏪 店铺开设与装修\n📝 产品上架优化\n🎯 推广引流方法\n📊 数据分析技巧\n⚠️ 风险规避指南\n🚀 批量操作方案\n\n特别赠送：\n• 500+虚拟产品资源包\n• 自动发货软件\n• 专属学员群\n\n一个人就能操作的生意，轻松实现睡后收入！'
      },
      {
        keywords: ['配音', '助手', '金Z'],
        text: '金Z配音助手是一款功能强大的语音合成软件，支持多种音色和语速调节。\n\n主要功能：\n🎙️ 支持多种语音引擎\n🗣️ 丰富的音色库\n⚡ 快速批量合成\n📝 SSML标记语言支持\n🎵 背景音乐添加\n📊 参数精细调整\n\n适用场景：\n• 有声书录制\n• 广告配音\n• 视频旁白\n• 教程解说\n• 播客节目\n• 客服语音\n\n安装简单，即装即用，让你的音频制作效率提升10倍！'
      },
      {
        keywords: ['去水印', '短视频', '无痕'],
        text: '短视频去水印神器，一键去除各平台水印，无痕保存！\n\n支持平台：\n✅ 抖音\n✅ 快手\n✅ 小红书\n✅ B站\n✅ 西瓜视频\n✅ 微视\n✅ 更多...\n\n功能特点：\n🔥 一键去水印\n🚀 批量处理\n📁 本地保存\n🎯 高清输出\n🔒 安全无痕\n⚡ 极速处理\n\n使用方法超简单：复制链接→粘贴→一键去水印→保存到相册\n\n自媒体人必备工具，每天节省大量时间！'
      },
      {
        keywords: ['多开', '浏览器', 'IP'],
        text: '多开浏览器是防关联的神器，每个窗口独立IP和缓存！\n\n核心功能：\n🌐 多窗口独立运行\n🔒 IP隔离保护\n📦 缓存独立存储\n🔐 Cookie隔离\n👤 指纹伪装\n⚙️ 自定义配置\n\n适用人群：\n• 电商多店铺运营\n• 自媒体多账号管理\n• 外贸业务员\n• 游戏工作室\n• 跨境电商卖家\n\n安全稳定，防封号效果显著，提高工作效率！'
      },
      {
        keywords: ['剪yin', '破J', '剪辑'],
        text: '剪yin专业版解锁全部VIP功能，视频剪辑从未如此简单！\n\n解锁功能：\n✨ 全部特效素材\n🎵 无版权音乐\n🎨 高级滤镜\n📐 专业字幕\n⚡ 导出无水印\n🎬 4K高清导出\n📊 高级调色\n🔄 云端同步\n\n内置教程：\n1. 剪辑基础入门\n2. 转场特效应用\n3. 字幕添加技巧\n4. 音乐卡点教学\n5. 调色滤镜使用\n6. 封面设计\n7. 导出设置优化\n\n新手友好，专业级效果，人人都是剪辑师！'
      },
      {
        keywords: ['克隆', '分身', '多开'],
        text: '克隆大师让你一个手机运行多个APP实例，互不干扰！\n\n强大功能：\n📱 APP无限多开\n🔒 数据完全隔离\n💾 独立存储空间\n⚡ 切换流畅不卡顿\n🎮 游戏多开挂机\n💬 微信多账号\n📧 邮箱多账户\n🛒 电商平台多店\n\n使用场景：\n• 游戏：小号练级、挂机刷资源\n• 社交：多微信号同时在线\n• 电商：多店铺同时管理\n• 营销：多账号推广\n\n稳定运行，兼容99%的APP，多账号管理必备！'
      },
      {
        keywords: ['抠图', '背景', '图片处理'],
        text: 'AI智能抠图换背景，神级图片处理工具，效果堪比PS！\n\n功能一览：\n🤖 AI自动抠图\n🎨 一键换背景\n✂️ 精细边缘调整\n📐 图片尺寸修改\n🎭 滤镜特效\n💾 批量处理\n📤 一键分享\n\n抠图类型：\n• 人像抠图\n• 商品抠图\n• Logo抠图\n• 复杂边缘抠图\n• 发丝级精细抠图\n\n背景模板：\n🌈 纯色背景\n🏢 办公场景\n🌿 自然风景\n🎉 节日主题\n📱 社交媒体尺寸\n\n电商、设计、自媒体人的得力助手！'
      },
      {
        keywords: ['矩阵', '投屏', '群控'],
        text: '矩阵投屏工具是自媒体人和游戏工作室的效率神器！\n\n核心能力：\n📱 一控多屏\n🎮 自动操作\n⏰ 定时任务\n📝 脚本录制\n🔄 循环执行\n📊 日志记录\n\n适用场景：\n• 短视频批量上传\n• 多账号直播\n• 游戏自动挂机\n• 电商客服回复\n• 社群消息群发\n• 数据采集录入\n\n解放双手，24小时自动工作，效率提升百倍！\n\n支持安卓设备，简单易用，小白也能快速上手！'
      },
      {
        keywords: ['录屏', '高清', 'PC端'],
        text: 'PC端高清录屏神器，专业级的屏幕录制体验！\n\n录制功能：\n🎥 全屏/区域录制\n🎙️ 同时录制声音\n📷 摄像头画中画\n⏱️ 计划任务录制\n🖱️ 鼠标点击高亮\n✏️ 实时标注绘画\n\n输出格式：\n📹 MP4高清\n🎵 音频提取\n📸 GIF动图\n\n编辑功能：\n✂️ 剪切合并\n🎨 添加字幕\n🎵 背景音乐\n⚡ 加速/减速\n📐 画面裁剪\n\n适用于：\n• 教程录制\n• 游戏直播回放\n• 会议记录\n• 软件演示\n• 远程协作\n\n免激活，永久使用，录屏从未如此简单！'
      },
      {
        keywords: ['白羊', '音乐', '听歌'],
        text: '白羊音乐是一款免费的音乐播放器，全网音乐想听就听！\n\n海量曲库：\n🎵 热门歌曲\n🎧 新歌首发\n📀 经典老歌\n🎶 纯音乐\n🎤 网络热歌\n🎹 古典音乐\n\n核心功能：\n🔍 全网搜索\n📥 高品质下载\n🎵 歌词显示\n📋 歌单创建\n🔀 随机播放\n🔁 循环播放\n⏭️ 上一首/下一首\n\n特色亮点：\n✅ 完全免费\n✅ 无广告打扰\n✅ 无需会员\n✅ 支持后台播放\n✅ 断点续传\n✅ 批量下载\n\n音乐爱好者必备，随时随地享受好音乐！'
      },
      {
        keywords: ['醒图', '国际', 'VIP'],
        text: '醒图国际高级版，解锁全部VIP滤镜和功能，修图从未如此简单！\n\n解锁内容：\n🎨 200+精品滤镜\n✨ 高级美颜功能\n🖼️ 贴纸素材库\n📝 艺术字体\n🎭 趣味表情\n🌟 特效光效\n📐 智能裁剪\n🎬 动态贴纸\n\n修图功能：\n💆 人像美容（瘦脸、大眼、祛痘）\n🎨 调色滤镜\n✂️ 拼图 collage\n📐 图片编辑\n🖌️ 涂鸦画画\n📊 模板套用\n\n使用场景：\n• 日常自拍美化\n• 电商产品图\n• 朋友圈配图\n• 小红书笔记\n• 证件照制作\n• 海报设计\n\n一键出大片，人人都是修图师！'
      },
      {
        keywords: ['变声', 'AI变声', '音色'],
        text: '实时变声工具，支持1000+种音色，聊天、游戏、直播都能用！\n\n音色分类：\n👧 萝莉音\n👩 御姐音\n👦 正太音\n👨 大叔音\n🤖 机器人音\n👽 怪兽音\n🎤 明星模仿音\n🎭 动漫角色音\n\n使用场景：\n🎮 游戏语音\n💬 QQ/微信语音\n📹 直播互动\n🎤 K歌娱乐\n📞 电话通话\n🎬 视频配音\n\n功能特点：\n⚡ 实时变声，无延迟\n🎚️ 音调/音速可调\n🔊 音质清晰自然\n📱 兼容主流APP\n🔒 隐私安全\n\n搞笑、整蛊、保护隐私，一应俱全！'
      }
    ]

    for (let tpl of templates) {
      for (let key of tpl.keywords) {
        if (title.includes(key)) {
          return tpl.text
        }
      }
    }

    return '本站精选优质资源，内容丰富详实，包含理论讲解和实操演示，适合各类学习者。\n\n课程特点：\n✅ 系统化教学体系\n✅ 实战案例丰富\n✅ 配套资料齐全\n✅ 售后答疑解惑\n\n学习收获：\n• 掌握核心技能\n• 了解行业趋势\n• 积累实战经验\n• 拓展人脉资源\n\n立即开始学习，成就更好的自己！'
  },

  generateFeatures(title) {
    return [
      '系统性教学，从入门到精通',
      '真实案例拆解，可复制执行',
      '配套工具资源，即学即用',
      '持续更新迭代，紧跟潮流'
    ]
  },

  generateAudience(title) {
    return [
      '想要副业增收的上班族',
      '寻找创业机会的自由职业者',
      '想提升技能的自媒体人',
      '对互联网感兴趣的初学者'
    ]
  },

  generateBenefits(title) {
    return [
      '掌握一项有价值的技能',
      '建立自己的收入来源',
      '拓展人脉和资源圈',
      '提升认知和思维方式'
    ]
  },

  onBack() {
    wx.navigateBack()
  },

  onShare() {
    wx.showToast({ title: '已分享', icon: 'success' })
  },

  onService() {
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

  onDownload() {
    const localVipExpire = wx.getStorageSync("vip_expire_time") || 0
    const now = Date.now()
    const localIsVip = localVipExpire > now

    const userId = wx.getStorageSync("user_id") || ""
    
    wx.cloud.callFunction({
      name: 'checkVipStatus',
      data: {
        userId: userId,
        openid: getApp().globalData.openid || wx.getStorageSync("openid") || ""
      }
    }).then(res => {
      let actualIsVip = localIsVip
      
      if (res.result && res.result.success) {
        actualIsVip = res.result.isVip
        
        if (actualIsVip !== localIsVip) {
          if (actualIsVip) {
            wx.setStorageSync("user_has_card", true)
            if (res.result.vipExpireTime > 0) {
              wx.setStorageSync("vip_expire_time", res.result.vipExpireTime)
            }
          } else {
            wx.setStorageSync("user_has_card", false)
            wx.setStorageSync("vip_expire_time", 0)
            
            wx.showToast({
              title: "您的VIP已被取消，请重新开通",
              icon: "none",
              duration: 2000
            })
            
            setTimeout(() => {
              wx.switchTab({ url: '/pages/vip/vip' })
            }, 1500)
            return
          }
          
          getApp().globalData.isVip = actualIsVip
        }
      }

      if (actualIsVip) {
        const link = this.data.downloadLink
        this.setData({ showLinkModal: true, currentLink: link })
      } else {
        wx.switchTab({ url: '/pages/vip/vip' })
      }
    }).catch(err => {
      console.error('验证VIP状态失败:', err)
      
      if (localIsVip) {
        const link = this.data.downloadLink
        this.setData({ showLinkModal: true, currentLink: link })
      } else {
        wx.switchTab({ url: '/pages/vip/vip' })
      }
    })
  },

  closeLinkModal() {
    this.setData({ showLinkModal: false })
  },

  onCopyLink() {
    wx.setClipboardData({
      data: this.data.currentLink,
      success: () => {
        wx.showToast({ title: '链接已复制', icon: 'success' })
        this.setData({ showLinkModal: false })
      }
    })
  },
})
