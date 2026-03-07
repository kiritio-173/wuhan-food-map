import React from 'react';
import { X, Star, DollarSign, Clock, Phone, MapPin, Navigation, Share2, Heart } from 'lucide-react';
import './RestaurantDetail.css';

const categoryColors = {
  '火锅': '#ff6b6b',
  '日料': '#4ecdc4',
  '咖啡': '#d4a574',
  '夜宵': '#2c3e50',
  '烧烤': '#e74c3c',
  '湖北菜': '#f39c12',
  '小吃': '#e67e22',
  '西餐': '#9b59b6',
  '奶茶': '#ff9ff3',
  '自助餐': '#3498db'
};

const RestaurantDetail = ({ restaurant, onClose }) => {
  if (!restaurant) return null;

  const handleNavigate = () => {
    const url = `https://map.baidu.com/search/${encodeURIComponent(restaurant.name)}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `推荐一家好店：${restaurant.name} - ${restaurant.review_summary}`,
        url: window.location.href
      });
    } else {
      alert('分享链接已复制到剪贴板');
    }
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        {/* 头部图片 */}
        <div className="detail-header">
          <img 
            src={(restaurant.images && restaurant.images[0]) || '/placeholder.jpg'} 
            alt={restaurant.name}
            className="header-image"
          />
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
          <span 
            className="category-tag"
            style={{ backgroundColor: categoryColors[restaurant.category] || '#3498db' }}
          >
            {restaurant.category}
          </span>
        </div>

        {/* 内容区域 */}
        <div className="detail-content">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          
          <div className="rating-section">
            <div className="rating-main">
              <Star size={24} fill="#f1c40f" />
              <span className="rating-score">{restaurant.rating}</span>
              <span className="rating-text">
                {restaurant.rating >= 4.5 ? '非常棒' : 
                 restaurant.rating >= 4.0 ? '很好' : '不错'}
              </span>
            </div>
            <div className="price-level">
              <DollarSign size={18} />
              {'¥'.repeat(restaurant.price_level)}
              <span className="price-text">
                {restaurant.price_level <= 2 ? '实惠' : 
                 restaurant.price_level <= 3 ? '适中' : '高端'}
              </span>
            </div>
          </div>

          <div className="info-section">
            <div className="info-item">
              <Clock size={18} />
              <span>{restaurant.opening_hours}</span>
              <span className={`status-badge ${restaurant.is_open ? 'open' : 'closed'}`}>
                {restaurant.is_open ? '营业中' : '已打烊'}
              </span>
            </div>
            
            <div className="info-item">
              <MapPin size={18} />
              <span>{restaurant.address}</span>
            </div>
            
            <div className="info-item">
              <Phone size={18} />
              <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
            </div>
          </div>

          <div className="tags-section">
            {restaurant.tags.map((tag, index) => (
              <span key={index} className="detail-tag">{tag}</span>
            ))}
          </div>

          <div className="review-section">
            <h3>评价摘要</h3>
            <p className="review-text">{restaurant.review_summary}</p>
            <p className="review-count">基于 {restaurant.review_count} 条评价</p>
          </div>

          {/* 热力指标 */}
          <div className="popularity-section">
            <h3>人气指数</h3>
            <div className="popularity-bar">
              <div 
                className="popularity-fill" 
                style={{ width: `${Math.min(restaurant.popularity / 100, 100)}%` }}
              />
            </div>
            <span className="popularity-text">
              {restaurant.popularity > 8000 ? '🔥 人气爆棚' :
               restaurant.popularity > 5000 ? '⭐ 人气很高' :
               restaurant.popularity > 3000 ? '👍 人气不错' : '💫 新晋好店'}
            </span>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="detail-footer">
          <button className="action-btn favorite" title="收藏">
            <Heart size={20} />
          </button>
          <button className="action-btn share" title="分享" onClick={handleShare}>
            <Share2 size={20} />
          </button>
          <button className="navigate-btn" onClick={handleNavigate}>
            <Navigation size={20} />
            导航前往
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
