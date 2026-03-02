const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: String,
  user_name: String,
  rating: { type: Number, min: 1, max: 5 },
  content: String,
  date: { type: Date, default: Date.now }
});

const restaurantSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, index: true },
  category: { 
    type: String, 
    required: true,
    enum: ['火锅', '日料', '咖啡', '夜宵', '烧烤', '湖北菜', '小吃', '西餐', '奶茶', '自助餐'],
    index: true 
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 5, default: 4.0, index: true },
  price_level: { type: Number, min: 1, max: 5, default: 2 }, // 1=便宜, 5=昂贵
  tags: [{ type: String, index: true }],
  images: [String],
  opening_hours: String,
  review_summary: String,
  address: String,
  phone: String,
  reviews: [reviewSchema],
  review_count: { type: Number, default: 0 },
  popularity: { type: Number, default: 0, index: true }, // 人气值
  is_open: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// 复合索引优化查询
restaurantSchema.index({ category: 1, rating: -1 });
restaurantSchema.index({ latitude: 1, longitude: 1 });
restaurantSchema.index({ price_level: 1 });

// 虚拟字段：距离（动态计算）
restaurantSchema.virtual('distance').get(function() {
  return this._distance;
});

restaurantSchema.set('toJSON', { virtuals: true });

// 更新中间件
restaurantSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
