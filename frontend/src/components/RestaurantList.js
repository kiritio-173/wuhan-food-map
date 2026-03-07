import React from 'react';

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

var placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3E%E66%3C/text%3E%3C/svg%3E';

function RestaurantList(props) {
  var restaurants = props.restaurants;
  if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) {
    return React.createElement('div', { className: 'empty-state' },
      React.createElement('p', null, '暂无符合条件的餐厅')
    );
  }

  var listElements = [];
  
  for (var i = 0; i < restaurants.length; i++) {
    var restaurant = restaurants[i];
    if (!restaurant) continue;
    
    var id = restaurant.id;
    var name = restaurant.name || '未命名';
    var category = restaurant.category || '';
    var rating = restaurant.rating || 0;
    var priceLevel = restaurant.price_level;
    var popularity = restaurant.popularity || 0;
    var address = restaurant.address || '';
    var tags = restaurant.tags;
    var reviewSummary = restaurant.review_summary || '';
    var images = restaurant.images;
    
    if (typeof priceLevel !== 'number' || priceLevel < 1) priceLevel = 1;
    var priceStr = '\u00a5'.repeat(priceLevel);
    
    var categoryColor = '#3498db';
    if (category && categoryColors[category]) {
      categoryColor = categoryColors[category];
    }
    
    var imgSrc = placeholderImg;
    if (images && Array.isArray(images) && images.length > 0 && images[0]) {
      imgSrc = images[0];
    }
    
    var tagElements = [];
    if (tags && Array.isArray(tags)) {
      for (var j = 0; j < Math.min(tags.length, 3); j++) {
        if (tags[j]) {
          tagElements.push(React.createElement('span', { key: j, className: 'tag' }, String(tags[j])));
        }
      }
    }
    
    var cardClass = 'restaurant-card';
    
    var onItemClick = props.onItemClick;
    
    listElements.push(
      React.createElement('div', {
        key: id || i,
        className: cardClass,
        onClick: function(r) { return function() { if (onItemClick) onItemClick(r); }; }(restaurant)
      },
        React.createElement('div', { className: 'card-image' },
          React.createElement('img', {
            src: imgSrc,
            alt: name,
            onError: function(e) { e.target.src = placeholderImg; }
          }),
          React.createElement('span', {
            className: 'category-badge',
            style: { backgroundColor: categoryColor }
          }, category)
        ),
        React.createElement('div', { className: 'card-content' },
          React.createElement('h3', { className: 'restaurant-name' }, name),
          React.createElement('div', { className: 'restaurant-meta' },
            React.createElement('span', { className: 'rating' }, '\u2b50 ' + rating),
            React.createElement('span', { className: 'price' }, priceStr),
            React.createElement('span', { className: 'popularity' }, popularity)
          ),
          React.createElement('p', { className: 'address' }, address),
          React.createElement('div', { className: 'tags' }, tagElements),
          React.createElement('p', { className: 'review-summary' }, reviewSummary)
        )
      )
    );
  }

  var layout = props.layout || 'list';
  return React.createElement('div', { className: 'restaurant-list ' + layout },
    listElements
  );
}

export default RestaurantList;
