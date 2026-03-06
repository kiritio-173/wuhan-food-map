import React from 'react';
import { Star, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import './RestaurantList.css';

var categoryColors = {
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

var placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3E暂无图片%3C/text%3E%3C/svg%3E';

function RestaurantList(props) {
  var restaurants = props.restaurants;
  var onItemClick = props.onItemClick;
  var selectedId = props.selectedId;
  var layout = props.layout || 'list';
  
  // 防御性处理
  if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) {
    return React.createElement('div', { className: 'empty-state' },
      React.createElement('p', null, '暂无符合条件的餐厅')
    );
  }

  var listElements = restaurants.map(function(restaurant) {
    // 防御性处理
    if (!restaurant) return null;
    
    var images = restaurant.images;
    var tags = restaurant.tags;
    if (!images || !Array.isArray(images)) images = [];
    if (!tags || !Array.isArray(tags)) tags = [];
    
    var imgSrc = images.length > 0 ? images[0] : placeholderImg;
    var cardClass = 'restaurant-card';
    if (selectedId === restaurant.id) {
      cardClass = cardClass + ' selected';
    }
    
    var categoryColor = categoryColors[restaurant.category] || '#3498db';
    var priceStr = '\u00a5'.repeat(restaurant.price_level || 1);
    
    var tagElements = tags.slice(0, 3).map(function(tag, index) {
      return React.createElement('span', { key: index, className: 'tag' }, tag);
    });
    
    return React.createElement('div', {
      key: restaurant.id,
      className: cardClass,
      onClick: function() { if (onItemClick) onItemClick(restaurant); }
    },
      React.createElement('div', { className: 'card-image' },
        React.createElement('img', {
          src: imgSrc,
          alt: restaurant.name || '餐厅',
          onError: function(e) { e.target.src = placeholderImg; }
        }),
        React.createElement('span', {
          className: 'category-badge',
          style: { backgroundColor: categoryColor }
        }, restaurant.category || '')
      ),
      React.createElement('div', { className: 'card-content' },
        React.createElement('h3', { className: 'restaurant-name' }, restaurant.name || '未命名'),
        React.createElement('div', { className: 'restaurant-meta' },
          React.createElement('span', { className: 'rating' },
            React.createElement(Star, { size: 14, fill: '#f1c40f' }),
            ' ' + (restaurant.rating || '0')
          ),
          React.createElement('span', { className: 'price' },
            React.createElement(DollarSign, { size: 14 }),
            ' ' + priceStr
          ),
          React.createElement('span', { className: 'popularity' },
            React.createElement(TrendingUp, { size: 14 }),
            ' ' + (restaurant.popularity || '0')
          )
        ),
        React.createElement('p', { className: 'address' },
          React.createElement(MapPin, { size: 14 }),
          ' ' + (restaurant.address || '')
        ),
        React.createElement('div', { className: 'tags' }, tagElements),
        React.createElement('p', { className: 'review-summary' }, restaurant.review_summary || '')
      )
    );
  });

  return React.createElement('div', { className: 'restaurant-list ' + layout },
    listElements
  );
}

export default RestaurantList;
