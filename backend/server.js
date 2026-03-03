const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// 内存中的餐厅数据（武汉美食）
let restaurants = [
  {
    id: '1',
    name: '海底捞火锅（武汉天地店）',
    category: '火锅',
    latitude: 30.5928,
    longitude: 114.3055,
    rating: 4.8,
    price_level: 4,
    tags: ['火锅', '连锁', '服务好', '网红'],
    address: '武汉市江汉区解放大道1288号',
    phone: '027-88888888',
    opening_hours: '10:00-22:00',
    review_summary: '服务一流，食材新鲜，武汉必打卡的火锅店',
    review_count: 256,
    popularity: 5200,
    is_open: true
  },
  {
    id: '2',
    name: '户部巷蔡林记',
    category: '湖北菜',
    latitude: 30.5532,
    longitude: 114.3092,
    rating: 4.5,
    price_level: 2,
    tags: ['热干面', '早餐', '老字号', '本地人推荐'],
    address: '武汉市武昌区户部巷步行街',
    phone: '027-88888889',
    opening_hours: '06:00-14:00',
    review_summary: '武汉最正宗的热干面，老字号味道',
    review_count: 189,
    popularity: 3200,
    is_open: true
  },
  {
    id: '3',
    name: '漫咖啡（花园道店）',
    category: '咖啡',
    latitude: 30.5785,
    longitude: 114.3156,
    rating: 4.3,
    price_level: 3,
    tags: ['咖啡', '下午茶', '安静', '适合办公'],
    address: '武汉市江汉区花园道商业街',
    phone: '027-88888890',
    opening_hours: '08:00-22:00',
    review_summary: '环境优雅，适合办公和商务洽谈',
    review_count: 145,
    popularity: 1800,
    is_open: true
  },
  {
    id: '4',
    name: '靓靓蒸虾',
    category: '夜宵',
    latitude: 30.5865,
    longitude: 114.3035,
    rating: 4.7,
    price_level: 3,
    tags: ['小龙虾', '夜宵', '必吃', '排队王'],
    address: '武汉市江岸区南京路',
    phone: '027-88888891',
    opening_hours: '17:00-02:00',
    review_summary: '武汉最火的小龙虾店，夏天必排队',
    review_count: 328,
    popularity: 4800,
    is_open: true
  },
  {
    id: '5',
    name: '燕子牛肉面',
    category: '小吃',
    latitude: 30.5842,
    longitude: 114.2985,
    rating: 4.4,
    price_level: 1,
    tags: ['牛肉面', '早餐', '地道', '性价比高'],
    address: '武汉市江汉区汉口火车站附近',
    phone: '027-88888892',
    opening_hours: '06:00-14:00',
    review_summary: '地道武汉味道，性价比超高',
    review_count: 167,
    popularity: 2100,
    is_open: true
  },
  {
    id: '6',
    name: '粗茶淡饭（汉街店）',
    category: '湖北菜',
    latitude: 30.5685,
    longitude: 114.3356,
    rating: 4.6,
    price_level: 3,
    tags: ['湖北菜', '精致', '环境好', '家庭聚餐'],
    address: '武汉市武昌区楚河汉街',
    phone: '027-88888893',
    opening_hours: '11:00-21:00',
    review_summary: '精致湖北菜，环境优雅',
    review_count: 213,
    popularity: 2800,
    is_open: true
  },
  {
    id: '7',
    name: '奈雪的茶（国广店）',
    category: '奶茶',
    latitude: 30.5912,
    longitude: 114.3012,
    rating: 4.2,
    price_level: 3,
    tags: ['奶茶', '烘焙', '网红', '下午茶'],
    address: '武汉市江汉区武商国际广场',
    phone: '027-88888894',
    opening_hours: '10:00-22:00',
    review_summary: '网红奶茶店，招牌饮品必尝',
    review_count: 198,
    popularity: 3500,
    is_open: true
  },
  {
    id: '8',
    name: '刘胖子家常菜',
    category: '湖北菜',
    latitude: 30.5756,
    longitude: 114.3125,
    rating: 4.5,
    price_level: 2,
    tags: ['家常菜', '实惠', '本地人', '烟火气'],
    address: '武汉市江汉区万松园路',
    phone: '027-88888895',
    opening_hours: '11:00-21:00',
    review_summary: '地道武汉家常菜，价格实惠',
    review_count: 145,
    popularity: 1900,
    is_open: true
  },
  {
    id: '9',
    name: '胖锅爷海鲜自助',
    category: '自助餐',
    latitude: 30.5885,
    longitude: 114.3185,
    rating: 4.4,
    price_level: 4,
    tags: ['自助餐', '海鲜', '吃到撑', '聚会'],
    address: '武汉市江汉区解放大道k11',
    phone: '027-88888896',
    opening_hours: '11:30-21:30',
    review_summary: '海鲜自助吃到撑，适合聚会',
    review_count: 176,
    popularity: 2600,
    is_open: true
  },
  {
    id: '10',
    name: '武商广场日料',
    category: '日料',
    latitude: 30.5915,
    longitude: 114.3015,
    rating: 4.6,
    price_level: 5,
    tags: ['日料', '刺身', '高端', '新鲜'],
    address: '武汉市江汉区武商广场7楼',
    phone: '027-88888897',
    opening_hours: '11:00-14:00 17:00-21:30',
    review_summary: '高端日料，食材新鲜',
    review_count: 134,
    popularity: 2200,
    is_open: true
  }
];

// 中间件
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'wuhan-food-map-backend',
    mode: 'memory'
  });
});

// 获取所有餐厅
app.get('/api/restaurants', (req, res) => {
  try {
    const { category, keyword, sort_by } = req.query;
    let result = [...restaurants];
    
    // 类别筛选
    if (category) {
      result = result.filter(r => r.category === category);
    }
    
    // 关键词搜索
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(kw) ||
        r.tags.some(t => t.toLowerCase().includes(kw)) ||
        r.address.toLowerCase().includes(kw)
      );
    }
    
    // 排序
    if (sort_by === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort_by === 'popularity') {
      result.sort((a, b) => b.popularity - a.popularity);
    } else if (sort_by === 'price') {
      result.sort((a, b) => a.price_level - b.price_level);
    }
    
    res.json({ success: true, data: result, total: result.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个餐厅
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, error: '餐厅不存在' });
  }
  res.json({ success: true, data: restaurant });
});

// 添加餐厅
app.post('/api/admin', (req, res) => {
  try {
    const newRestaurant = {
      ...req.body,
      id: Date.now().toString(),
      review_count: 0,
      popularity: 0,
      is_open: true,
      created_at: new Date().toISOString()
    };
    restaurants.push(newRestaurant);
    res.status(201).json({ success: true, data: newRestaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新餐厅
app.put('/api/admin/:id', (req, res) => {
  const index = restaurants.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: '餐厅不存在' });
  }
  restaurants[index] = { ...restaurants[index], ...req.body };
  res.json({ success: true, data: restaurants[index] });
});

// 删除餐厅
app.delete('/api/admin/:id', (req, res) => {
  const index = restaurants.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: '餐厅不存在' });
  }
  restaurants.splice(index, 1);
  res.json({ success: true, message: '删除成功' });
});

// 推荐附近餐厅
app.get('/api/recommendations/nearby', (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: '请提供经纬度' });
  }
  
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  
  // 简单距离计算
  const getDistance = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
  };
  
  let result = restaurants
    .map(r => ({
      ...r,
      distance: getDistance(userLat, userLng, r.latitude, r.longitude)
    }))
    .filter(r => r.distance <= radius / 111) // 粗略转换
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
  
  res.json({ success: true, data: result });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`🚀 武汉美食地图后端运行在 http://localhost:${PORT}`);
  console.log(`📍 API地址: http://localhost:${PORT}/api`);
  console.log(`📊 餐厅数量: ${restaurants.length}`);
});
