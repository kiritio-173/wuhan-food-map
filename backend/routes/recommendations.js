const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

/**
 * @route GET /api/recommendations/personalized
 * @desc 获取个性化推荐（预留AI接口）
 * @query user_id - 用户ID
 * @query lat/lng - 当前位置
 * @query limit - 返回数量
 */
router.get('/personalized', async (req, res) => {
  try {
    const { user_id, lat, lng, limit = 10 } = req.query;

    // TODO: 接入AI推荐算法
    // 当前使用简单加权算法：评分*0.4 + 人气*0.3 + 距离*0.3
    
    let restaurants = await Restaurant.find({ rating: { $gte: 4.0 } })
      .sort({ popularity: -1, rating: -1 })
      .limit(parseInt(limit) * 2)
      .lean();

    // 如果有位置信息，计算推荐分数
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      restaurants = restaurants.map(r => {
        const distance = Math.sqrt(
          Math.pow(r.latitude - latitude, 2) + 
          Math.pow(r.longitude - longitude, 2)
        ) * 111;

        // 推荐分数计算（简化版协同过滤）
        const distanceScore = Math.max(0, 10 - distance) / 10; // 距离越近分数越高
        const ratingScore = r.rating / 5;
        const popularityScore = Math.min(r.popularity / 1000, 1);

        const recommendation_score = (
          ratingScore * 0.4 + 
          popularityScore * 0.3 + 
          distanceScore * 0.3
        ) * 100;

        return {
          ...r,
          distance: parseFloat(distance.toFixed(2)),
          recommendation_score: parseFloat(recommendation_score.toFixed(2))
        };
      }).sort((a, b) => b.recommendation_score - a.recommendation_score);
    }

    // 返回前N个
    const results = restaurants.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: results,
      meta: {
        algorithm: 'weighted_collaborative_filtering_v1',
        factors: ['rating', 'popularity', 'distance'],
        user_id: user_id || 'anonymous'
      }
    });

  } catch (error) {
    console.error('获取推荐失败:', error);
    res.status(500).json({ success: false, error: '获取推荐失败' });
  }
});

/**
 * @route GET /api/recommendations/hot
 * @desc 获取热门餐厅
 */
router.get('/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const restaurants = await Restaurant.find()
      .sort({ popularity: -1, rating: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: restaurants,
      meta: { type: 'hot', limit: parseInt(limit) }
    });

  } catch (error) {
    console.error('获取热门餐厅失败:', error);
    res.status(500).json({ success: false, error: '获取热门餐厅失败' });
  }
});

/**
 * @route GET /api/recommendations/similar/:id
 * @desc 获取相似餐厅（基于类别和标签）
 */
router.get('/similar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    const target = await Restaurant.findOne({ id }).lean();
    if (!target) {
      return res.status(404).json({ success: false, error: '餐厅不存在' });
    }

    // 查找同类别的餐厅，排除自己
    const similar = await Restaurant.find({
      id: { $ne: id },
      $or: [
        { category: target.category },
        { tags: { $in: target.tags } }
      ]
    })
    .sort({ rating: -1, popularity: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      data: similar,
      meta: { 
        target_id: id,
        based_on: ['category', 'tags'],
        target_category: target.category
      }
    });

  } catch (error) {
    console.error('获取相似餐厅失败:', error);
    res.status(500).json({ success: false, error: '获取相似餐厅失败' });
  }
});

module.exports = router;
