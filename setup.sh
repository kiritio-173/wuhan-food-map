#!/bin/bash

echo "🚀 武汉美食地图 - 快速启动脚本"
echo "================================"

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js，请先安装Node.js 18+"
    exit 1
fi

# 检查是否安装了MongoDB（可选）
if command -v mongod &> /dev/null; then
    echo "✅ 检测到MongoDB"
    MONGO_AVAILABLE=true
else
    echo "⚠️  未检测到MongoDB，将使用内存模式运行"
    MONGO_AVAILABLE=false
fi

echo ""
echo "📦 安装后端依赖..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo ""
echo "📦 安装前端依赖..."
cd ../frontend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo ""
echo "🌱 导入示例数据..."
cd ../backend
if [ "$MONGO_AVAILABLE" = true ]; then
    npm run seed
else
    echo "⚠️  跳过数据导入（MongoDB未安装）"
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "🎯 启动项目:"
echo "  方式1 - 同时运行（推荐）:"
echo "    终端1: cd backend && npm start"
echo "    终端2: cd frontend && npm start"
echo ""
echo "  方式2 - 使用tmux（如果已安装）:"
echo "    ./start-with-tmux.sh"
echo ""
echo "📍 访问地址:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3001"
echo ""
