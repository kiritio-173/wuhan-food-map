const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

/**
 * @route GET /api/restaurants
 * @desc 获取餐厅列表（支持筛选、排序、分页）
 * @query category - 类别筛选
 * @query min_rating - 最低评分
 * @query max_price - 最高价格等级
 * @query sort_by - 排序字段 (rating/price/popularity/distance)
 * @query sort_order - 排序方向 (asc/desc)
 * @query page - 页码
 * @query limit - 每页数量
 * @query lat/lng - 当前位置（用于距离排序）
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      min_rating = 0,
      max_price = 5,
      sort_by = 'rating',
      sort_order = 'desc',
      page = 1,
      limit = 20,
      lat,
      lng,
      keyword,
      tags
    } = req.query;

    // 构建查询条件
    const query = {
      rating: { $gte: parseFloat(min_rating) },
      price_level: { $lte: parseInt(max_price) }
    };

    if (category) {
      query.category = category;
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } },
        { address: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // 构建排序
    let sortOption = {};
    if (sort_by === 'distance' && lat && lng) {
      // 距离排序需要聚合管道
      const restaurants = await Restaurant.aggregate([
        { $match: query },
        {
          $addFields: {
            distance: {
              $sqrt: {
                $add: [
                  { $pow: [{ $subtract: ['$latitude', parseFloat(lat)] }, 2] },
                  { $pow: [{ $subtract: ['$longitude', parseFloat(lng)] }, 2] }
                ]
              }
            }
          }
        },
        { $sort: { distance: sort_order === 'asc' ? 1 : -1 } },
        { $skip: (parseInt(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) }
      ]);

      const total = await Restaurant.countDocuments(query);

      return res.json({
        success: true,
        data: restaurants,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      });
    } else {
      sortOption[sort_by] = sort_order === 'asc' ? 1 : -1;
    }

    // 执行查询
    const restaurants = await Restaurant.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('获取餐厅列表失败:', error);
    res.status(500).json({ success: false, error: '获取餐厅列表失败' });
  }
});

/**
 * @route GET /api/restaurants/:id
 * @desc 获取餐厅详情
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: req.params.id }).lean();
    
    if (!restaurant) {
      return res.status(404).json({ success: false, error: '餐厅不存在' });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('获取餐厅详情失败:', error);
    res.status(500).json({ success: false, error: '获取餐厅详情失败' });
  }
});

/**
 * @route GET /api/restaurants/nearby/search
 * @desc 搜索附近餐厅
 * @query lat - 纬度
 * @query lng - 经度
 * @query radius - 搜索半径（公里）
 */
router.get('/nearby/search', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: '需要提供经纬度' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // 简化的距离计算（实际生产环境应使用MongoDB地理空间索引）
    const restaurants = await Restaurant.find({
      latitude: { 
        $gte: latitude - searchRadius * 0.01, 
        $lte: latitude + searchRadius * 0.01 
      },
      longitude: { 
        $gte: longitude - searchRadius * 0.01, 
        $lte: longitude + searchRadius * 0.01 
      }
    }).lean();

    // 计算实际距离并排序
    const restaurantsWithDistance = restaurants.map(r => {
      const distance = Math.sqrt(
        Math.pow(r.latitude - latitude, 2) + 
        Math.pow(r.longitude - longitude, 2)
      ) * 111; // 转换为公里（近似）
      
      return { ...r, distance: parseFloat(distance.toFixed(2)) };
    }).filter(r => r.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: restaurantsWithDistance,
      meta: {
        center: { lat: latitude, lng: longitude },
        radius: searchRadius,
        count: restaurantsWithDistance.length
      }
    });

  } catch (error) {
    console.error('搜索附近餐厅失败:', error);
    res.status(500).json({ success: false, error: '搜索失败' });
  }
});

/**
 * @route GET /api/restaurants/categories/list
 * @desc 获取所有类别统计
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Restaurant.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avg_rating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(c => ({
        category: c._id,
        count: c.count,
        avg_rating: parseFloat(c.avg_rating.toFixed(2))
      }))
    });

  } catch (error) {
    console.error('获取类别统计失败:', error);
    res.status(500).json({ success: false, error: '获取类别统计失败' });
  }
});

module.exports = router;
