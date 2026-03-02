import React from 'react';
import { Star, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import './RestaurantList.css';

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

const RestaurantList = ({ restaurants, onItemClick, selectedId, layout = 'list' }) => {
  if (restaurants.length === 0) {
    return (
      <div className="empty-state">
        <p>暂无符合条件的餐厅</p>
      </div>
    );
  }

  return (
    <div className={`restaurant-list ${layout}`}>
      {restaurants.map(restaurant => (
        <div
          key={restaurant.id}
          className={`restaurant-card ${selectedId === restaurant.id ? 'selected' : ''}`}
          onClick={() => onItemClick(restaurant)}
        >
          <div className="card-image">
            <img 
              src={restaurant.images[0] || '/placeholder.jpg'} 
              alt={restaurant.name}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E';
              }}
            />
            <span 
              className="category-badge"
              style={{ backgroundColor: categoryColors[restaurant.category] || '#3498db' }}
            >
              {restaurant.category}
            </span>
          </div>
          
          <div className="card-content">
            <h3 className="restaurant-name">{restaurant.name}</h3>
            
            <div className="restaurant-meta">
              <span className="rating">
                <Star size={14} fill="#f1c40f" />
                {restaurant.rating}
              </span>
              <span className="price">
                <DollarSign size={14} />
                {'¥'.repeat(restaurant.price_level)}
              </span>
              <span className="popularity">
                <TrendingUp size={14} />
                {restaurant.popularity}
              </span>
            </div>
            
            <p className="address">
              <MapPin size={14} />
              {restaurant.address}
            </p>
            
            <div className="tags">
              {restaurant.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            
            <p className="review-summary">{restaurant.review_summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
