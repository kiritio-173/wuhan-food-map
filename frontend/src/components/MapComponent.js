import React from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

// 高德地图配置
AMapLoader.load({
  key: 'a23644d32131d5b1794eed25d62c73e8',
  version: '2.0',
  securityJsCode: '16003b0ac1ab4409e360f6c110291663',
  plugins: ['AMap.Scale', 'AMap.ToolBar']
}).then(AMap => {
  window.AMap = AMap;
  console.log('高德地图加载成功');
}).catch(e => {
  console.error('高德地图加载失败:', e);
});

// 类别颜色
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

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.markers = [];
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    this.initMap();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.restaurants !== this.props.restaurants) {
      this.updateMarkers();
    }
    // 当选中的餐厅变化时，移动到该位置
    if (prevProps.selectedRestaurant !== this.props.selectedRestaurant) {
      var selectedRestaurant = this.props.selectedRestaurant;
      if (selectedRestaurant && selectedRestaurant.latitude && selectedRestaurant.longitude && this.map) {
        this.map.setCenter([selectedRestaurant.longitude, selectedRestaurant.latitude]);
        this.map.setZoom(15);
      }
    }
  }

  initMap() {
    if (!window.AMap) {
      var checkAMap = setInterval(function() {
        if (window.AMap) {
          clearInterval(checkAMap);
          this.createMap();
        }
      }.bind(this), 100);
    } else {
      this.createMap();
    }
  }

  createMap() {
    var AMap = window.AMap;
    this.map = new AMap.Map(this.mapContainer.current, {
      zoom: 12,
      center: [114.3055, 30.5928],
      viewMode: '2D'
    });

    this.map.addControl(new AMap.Scale());
    this.map.addControl(new AMap.ToolBar({ position: 'RT' }));

    this.updateMarkers();
  }

  updateMarkers() {
    if (!this.map || !window.AMap) return;
    
    var AMap = window.AMap;
    var restaurants = this.props.restaurants || [];
    var onRestaurantClick = this.props.onRestaurantClick;
    
    // 清除旧标记
    var self = this;
    this.markers.forEach(function(m) {
      self.map.remove(m);
    });
    this.markers = [];

    // 添加新标记
    restaurants.forEach(function(restaurant) {
      if (!restaurant.latitude || !restaurant.longitude) return;

      var color = categoryColors[restaurant.category] || '#3498db';
      
      var content = document.createElement('div');
      content.style.cssText = 'background:' + color + ';width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;';
      content.innerHTML = '📍';

      var marker = new AMap.Marker({
        position: [restaurant.longitude, restaurant.latitude],
        content: content,
        title: restaurant.name,
        offset: new AMap.Pixel(-16, -32)
      });

      marker.on('click', function() {
        if (onRestaurantClick) {
          onRestaurantClick(restaurant);
        }
      });

      marker.on('mouseover', function() {
        var infoWindow = new AMap.InfoWindow({
          content: '<div style="padding:8px;"><h4 style="margin:0 0 8px;">' + restaurant.name + '</h4><p style="margin:4px 0;color:#666;">类别: ' + restaurant.category + '</p><p style="margin:4px 0;color:#f1c40f;">⭐ ' + restaurant.rating + '</p><p style="margin:4px 0;color:#666;">📍 ' + restaurant.address + '</p></div>',
          offset: new AMap.Pixel(0, -30)
        });
        infoWindow.open(self.map, marker.getPosition());
      });

      marker.setMap(self.map);
      self.markers.push(marker);
    });

    // 如果有选中的餐厅
    var selectedRestaurant = this.props.selectedRestaurant;
    if (selectedRestaurant && selectedRestaurant.latitude && selectedRestaurant.longitude) {
      this.map.setCenter([selectedRestaurant.longitude, selectedRestaurant.latitude]);
    }
  }

  render() {
    return React.createElement('div', {
      ref: this.mapContainer,
      style: { width: '100%', height: '100%', minHeight: '400px' }
    });
  }
}

export default MapComponent;
