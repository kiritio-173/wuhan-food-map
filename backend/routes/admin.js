const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { v4: uuidv4 } = require('uuid');

/**
 * @route POST /api/restaurants
 * @desc 创建新餐厅
 */
router.post('/', async (req, res) => {
  try {
    const restaurantData = req.body;
    
    // 生成唯一ID
    restaurantData.id = uuidv4();
    
    // 创建餐厅
    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();
    
    res.status(201).json({
      success: true,
      message: '餐厅创建成功',
      data: restaurant
    });
  } catch (error) {
    console.error('创建餐厅失败:', error);
    res.status(500).json({
      success: false,
      error: '创建餐厅失败: ' + error.message
    });
  }
});

/**
 * @route PUT /api/restaurants/:id
 * @desc 更新餐厅信息
 */
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    updates.updated_at = Date.now();
    
    const restaurant = await Restaurant.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: '餐厅不存在'
      });
    }
    
    res.json({
      success: true,
      message: '餐厅更新成功',
      data: restaurant
    });
  } catch (error) {
    console.error('更新餐厅失败:', error);
    res.status(500).json({
      success: false,
      error: '更新餐厅失败: ' + error.message
    });
  }
});

/**
 * @route DELETE /api/restaurants/:id
 * @desc 删除餐厅
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await Restaurant.deleteOne({ id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: '餐厅不存在'
      });
    }
    
    res.json({
      success: true,
      message: '餐厅删除成功'
    });
  } catch (error) {
    console.error('删除餐厅失败:', error);
    res.status(500).json({
      success: false,
      error: '删除餐厅失败'
    });
  }
});

module.exports = router;
