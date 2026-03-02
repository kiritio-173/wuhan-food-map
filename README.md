# 🗺️ 武汉智能美食地图 (Wuhan Food Discovery Map)

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> 🍜 发现武汉最地道的美食！基于地图的智能餐厅推荐系统

## ✨ 功能特性

### 🎯 核心功能
- 🗺️ **地图可视化** - 基于 OpenStreetMap 的交互式地图展示
- 🔍 **智能搜索** - 支持按名称、类别、标签、地址搜索
- 🏷️ **分类筛选** - 火锅/日料/咖啡/夜宵/湖北菜等10+类别
- ⭐ **排序功能** - 按评分、价格、人气排序
- 📍 **定位服务** - 获取当前位置，查找附近餐厅
- 📱 **响应式设计** - 完美适配桌面和移动端

### 🎨 UI特性
- 🌙 **深色模式** - 支持亮色/暗色主题切换
- 🎴 **类别图例** - 不同类别显示不同颜色标记
- 📊 **人气指数** - 可视化展示餐厅热度
- 🖼️ **详情弹窗** - 图片、评价、营业信息等完整展示

### 🔧 管理功能
- ➕ **添加餐厅** - 支持添加新餐厅信息
- 📝 **完整信息** - 名称、地址、电话、坐标、评分、价格等
- 📍 **坐标获取** - 一键获取当前GPS坐标

## 🏗 技术架构

### 前端
- **React 18** - 现代React开发
- **Leaflet** - 开源地图库（OpenStreetMap）
- **MarkerCluster** - 标记点聚合
- **Lucide React** - 图标库
- **CSS Variables** - 主题切换支持

### 后端
- **Node.js + Express** - RESTful API
- **MongoDB** - 数据存储
- **Mongoose** - ODM框架
- **Helmet + CORS** - 安全中间件

### 数据库结构
```javascript
{
  id: String,           // 唯一标识
  name: String,         // 餐厅名称
  category: String,     // 类别
  latitude: Number,     // 纬度
  longitude: Number,    // 经度
  rating: Number,       // 评分
  price_level: Number,  // 价格等级(1-5)
  tags: [String],       // 标签
  images: [String],     // 图片URL
  opening_hours: String,// 营业时间
  review_summary: String,// 评价摘要
  address: String,      // 地址
  phone: String,        // 电话
  review_count: Number, // 评论数
  popularity: Number,   // 人气值
  is_open: Boolean      // 是否营业
}
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- MongoDB >= 6.0 (可选，支持内存模式)
- npm >= 9.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/kiritio-173/wuhan-food-map.git
cd wuhan-food-map
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **安装前端依赖**
```bash
cd ../frontend
npm install
```

4. **配置环境变量**
```bash
# backend/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wuhan_food_map
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

5. **导入Mock数据（可选）**
```bash
cd backend
npm run seed
```

### 运行项目

**方式1：同时运行前后端（推荐）**
```bash
# 终端1 - 启动后端
cd backend
npm start

# 终端2 - 启动前端
cd frontend
npm start
```

**方式2：开发模式（热重载）**
```bash
# 后端
cd backend
npm run dev

# 前端
cd frontend
npm start
```

访问 http://localhost:3000 查看应用

## 📖 使用指南

### 查看餐厅
1. 打开地图页面，自动显示所有餐厅标记
2. 点击标记查看餐厅详情弹窗
3. 使用侧边栏浏览餐厅列表

### 搜索筛选
1. 顶部搜索框输入关键词
2. 点击筛选按钮选择类别、评分、价格
3. 支持排序：评分最高/人气最高/价格最低

### 添加餐厅
1. 点击右上角"+"按钮
2. 填写餐厅信息（名称、地址、坐标等）
3. 点击"获取当前位置"自动填入坐标
4. 提交后餐厅立即显示在地图上

### 切换主题
- 点击右上角月亮/太阳图标切换深色/浅色模式

## 🔌 API 文档

### 餐厅列表
```
GET /api/restaurants
参数:
  - category: 类别筛选
  - keyword: 关键词搜索
  - sort_by: 排序字段 (rating/popularity/price)
  - page/limit: 分页
```

### 餐厅详情
```
GET /api/restaurants/:id
```

### 附近搜索
```
GET /api/restaurants/nearby/search?lat=30.59&lng=114.31&radius=5
```

### 添加餐厅
```
POST /api/admin
Body: 餐厅完整信息JSON
```

## 📁 项目结构

```
wuhan-food-map/
├── backend/              # 后端代码
│   ├── models/          # 数据模型
│   ├── routes/          # API路由
│   ├── data/            # Mock数据
│   ├── scripts/         # 工具脚本
│   ├── server.js        # 入口文件
│   └── package.json
├── frontend/            # 前端代码
│   ├── public/          # 静态资源
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── data/        # Mock数据
│   │   ├── App.js       # 主应用
│   │   └── index.js     # 入口
│   └── package.json
├── docs/                # 文档
└── README.md
```

## 🌟 高级功能规划

- [ ] 🤖 AI推荐算法 - 基于用户偏好的协同过滤
- [ ] 🔥 热力图 - 显示人气区域分布
- [ ] 💬 用户评论系统 - 真实用户评价
- [ ] 📊 情感分析 - 评论情感倾向分析
- [ ] 📍 实时导航 - 集成地图导航
- [ ] 📱 微信小程序 - 移动端适配
- [ ] 🖼️ 图片上传 - 餐厅照片管理

## 🛠 常见问题

**Q: 无法连接MongoDB？**
A: 系统会自动切换到内存模式，数据不会持久化但功能完整。

**Q: 地图显示空白？**
A: 检查网络连接，地图使用OpenStreetMap在线服务。

**Q: 如何修改默认城市？**
A: 修改 `frontend/src/App.js` 中的 `mapCenter` 坐标。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系

如有问题或建议，欢迎联系：
- Email: kiritio173@gmail.com
- GitHub: [@kiritio-173](https://github.com/kiritio-173)

---

🍜 **Made with love for Wuhan Food Lovers** 🍜
