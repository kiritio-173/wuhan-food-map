const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const wuhanRestaurants = require('./restaurantSeeds');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wuhan_food_map';

async function seedDatabase() {
  try {
    console.log('🌱 开始导入数据...');
    
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 清空现有数据
    await Restaurant.deleteMany({});
    console.log('🗑️  已清空旧数据');

    // 插入新数据
    const result = await Restaurant.insertMany(wuhanRestaurants);
    console.log(`✅ 成功导入 ${result.length} 家餐厅数据`);

    // 显示统计
    const stats = await Restaurant.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 数据分布:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}家`);
    });

    console.log('\n🎉 数据导入完成！');
    process.exit(0);

  } catch (error) {
    console.error('❌ 数据导入失败:', error);
    process.exit(1);
  }
}

// 内存模式（无MongoDB时）
async function exportToJSON() {
  const fs = require('fs');
  const path = require('path');
  
  const outputPath = path.join(__dirname, 'restaurants.json');
  fs.writeFileSync(outputPath, JSON.stringify(wuhanRestaurants, null, 2));
  
  console.log(`✅ 数据已导出到: ${outputPath}`);
  console.log(`📊 共 ${wuhanRestaurants.length} 家餐厅`);
}

// 如果直接运行此脚本
if (require.main === module) {
  // 尝试连接数据库，失败则导出JSON
  seedDatabase().catch(() => {
    console.log('⚠️  MongoDB连接失败，导出JSON文件...');
    exportToJSON();
  });
}

module.exports = { seedDatabase, exportToJSON, wuhanRestaurants };
