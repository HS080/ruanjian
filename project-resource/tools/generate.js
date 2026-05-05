const tcb = require('@cloudbase/node-sdk')

// 配置
const config = {
  envId: 'cloud1-d2gh0liegda761092',
  // 如果需要密钥，去腾讯云控制台获取
  // secretId: '你的secretId',
  // secretKey: '你的secretKey',
}

function generateCardKey(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function generateCards(count = 10, duration = 365, length = 10) {
  console.log(`\n🎫 开始生成 ${count} 张卡密...`)
  console.log(`   有效期: ${duration} 天`)
  console.log(`   长度: ${length} 位\n`)

  const cards = []
  const usedKeys = new Set()

  while (cards.length < count) {
    const key = generateCardKey(length)
    if (!usedKeys.has(key)) {
      usedKeys.add(key)
      cards.push({
        key,
        duration: parseInt(duration),
        used: false,
        usedTime: null,
        usedBy: null,
        createTime: new Date().toISOString().split('T')[0]
      })
    }
  }

  console.log('✅ 卡密生成完成！\n')
  
  // 显示生成的卡密
  cards.forEach((card, i) => {
    console.log(`  ${i + 1}. ${card.key}`)
  })

  return cards
}

// 导出为JSON文件
function exportToJSON(cards, filename) {
  const fs = require('fs')
  fs.writeFileSync(filename, JSON.stringify(cards, null, 2))
  console.log(`\n💾 已导出到: ${filename}`)
}

// 主程序
async function main() {
  const args = process.argv.slice(2)
  
  let count = 10
  let duration = 365
  let length = 10
  
  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n' || args[i] === '--count') count = parseInt(args[++i])
    if (args[i] === '-d' || args[i] === '--duration') duration = parseInt(args[++i])
    if (args[i] === '-l' || args[i] === '--length') length = parseInt(args[++i])
    if (args[i] === '-h' || args[i] === '--help') {
      console.log(`
🎫 卡密批量生成工具

用法: node generate.js [选项]

选项:
  -n, --count <数量>     生成数量 (默认: 10)
  -d, --duration <天数>  有效期天数 (默认: 365)
  -l, --length <长度>    卡密长度 (默认: 10)
  -h, --help            显示帮助信息

示例:
  node generate.js                          # 生成10张年度卡密
  node generate.js -n 50 -d 30              # 生成50张月度卡密
  node generate.js -n 100 -d 99999 -l 12    # 生成100张终身卡密(12位)
`)
      process.exit(0)
    }
  }

  const cards = await generateCards(count, duration, length)
  
  // 自动导出
  exportToJSON(cards, `cards_${Date.now()}.json`)
  
  console.log('\n' + '='.repeat(50))
  console.log('📋 下一步操作:')
  console.log('  1. 打开云开发控制台 → 数据库 → cardKeys')
  console.log('  2. 点击「导入」按钮')
  console.log('  3. 选择刚生成的 JSON 文件')
  console.log('  4. 确认导入\n')
}

main().catch(console.error)

module.exports = { generateCards, generateCardKey }
