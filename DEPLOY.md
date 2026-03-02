# 🚀 部署指南

## 快速开始（5分钟）

### 方式1：一键安装脚本
```bash
git clone https://github.com/kiritio-173/wuhan-food-map.git
cd wuhan-food-map
chmod +x setup.sh
./setup.sh
```

### 方式2：手动安装

**1. 克隆项目**
```bash
git clone https://github.com/kiritio-173/wuhan-food-map.git
cd wuhan-food-map
```

**2. 安装后端依赖**
```bash
cd backend
npm install
```

**3. 安装前端依赖**
```bash
cd ../frontend
npm install --legacy-peer-deps
```

**4. 配置环境变量**
```bash
cd ../backend
cp .env.example .env
# 编辑 .env 文件
```

**5. 启动服务**
```bash
# 终端1 - 后端
cd backend
npm start

# 终端2 - 前端
cd frontend
npm start
```

访问 http://localhost:3000 查看应用

---

## 生产环境部署

### 使用 Docker 部署

**1. 创建 Dockerfile（后端）**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

**2. 创建 Dockerfile（前端）**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**3. docker-compose.yml**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/wuhan_food_map
      - NODE_ENV=production
    depends_on:
      - mongodb
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

**4. 部署**
```bash
docker-compose up -d
```

### 使用 Vercel 部署前端

**1. 安装 Vercel CLI**
```bash
npm i -g vercel
```

**2. 部署**
```bash
cd frontend
vercel --prod
```

### 使用 Railway/Render 部署后端

**1. 连接GitHub仓库**
- 在 Railway/Render 控制台连接仓库
- 选择 backend 目录
- 设置环境变量

**2. 环境变量配置**
```
NODE_ENV=production
MONGODB_URI=<你的MongoDB连接字符串>
FRONTEND_URL=<前端域名>
```

---

## 环境变量说明

### 后端 (.env)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务端口号 | 3001 |
| MONGODB_URI | MongoDB连接字符串 | mongodb://localhost:27017/wuhan_food_map |
| FRONTEND_URL | 前端地址 | http://localhost:3000 |
| NODE_ENV | 运行环境 | development |

### 前端 (.env)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| REACT_APP_API_URL | 后端API地址 | http://localhost:3001/api |

---

## 常见问题

**Q: 前端安装依赖失败？**
A: 尝试使用 `--legacy-peer-deps` 参数
```bash
npm install --legacy-peer-deps
```

**Q: 地图显示空白？**
A: 检查网络连接，确保能访问 OpenStreetMap

**Q: MongoDB连接失败？**
A: 系统会自动切换到内存模式，数据不会持久化但功能完整

**Q: 如何修改默认城市？**
A: 修改 `frontend/src/App.js` 中的 `mapCenter` 坐标

---

## 性能优化建议

1. **启用Gzip压缩** - 减少传输大小
2. **使用CDN** - 加速静态资源访问
3. **启用缓存** - 合理设置HTTP缓存头
4. **数据库索引** - 确保常用查询字段已建立索引
5. **图片优化** - 使用WebP格式，启用懒加载

---

## 安全建议

1. 生产环境使用 HTTPS
2. 配置 CORS 白名单
3. 启用 Rate Limiting（已内置）
4. 使用 Helmet 安全头（已内置）
5. 定期更新依赖包
6. 不在前端暴露敏感API密钥

---

## 监控与维护

建议使用以下工具：
- **日志**: Winston 或 LogRocket
- **性能**: New Relic 或 Datadog
- **错误追踪**: Sentry
- **Uptime**: UptimeRobot
