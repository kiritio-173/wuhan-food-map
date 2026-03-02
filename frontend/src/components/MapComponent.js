import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MapPin, Star, DollarSign, Clock, Phone, Navigation } from 'lucide-react';
import './MapComponent.css';

// 修复Leaflet默认图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 类别颜色映射
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

// 创建自定义图标
const createCustomIcon = (category, rating) => {
  const color = categoryColors[category] || '#3498db';
  const size = rating >= 4.5 ? 32 : 24;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size / 2}px;
      ">
        ${rating.toFixed(1)}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// 地图中心控制组件
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ 
  restaurants, 
  selectedRestaurant, 
  onMarkerClick,
  userLocation,
  filters 
}) => {
  const [mapCenter, setMapCenter] = useState([30.5928, 114.3055]); // 武汉中心
  const [mapZoom, setMapZoom] = useState(12);

  // 当选择餐厅时，地图移动到该位置
  useEffect(() => {
    if (selectedRestaurant) {
      setMapCenter([selectedRestaurant.latitude, selectedRestaurant.longitude]);
      setMapZoom(16);
    }
  }, [selectedRestaurant]);

  // 使用用户位置
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // 筛选餐厅
  const filteredRestaurants = restaurants.filter(r => {
    if (filters.category && r.category !== filters.category) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.maxPrice && r.price_level > filters.maxPrice) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      return r.name.toLowerCase().includes(keyword) ||
             r.tags.some(tag => tag.toLowerCase().includes(keyword));
    }
    return true;
  });

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* 用户位置标记 */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div class="user-location-dot"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          />
        )}

        {/* 餐厅标记集群 */}
        <MarkerClusterGroup
          chunkedLoading
          spiderfyDistanceMultiplier={2}
        >
          {filteredRestaurants.map(restaurant => (
            <Marker
              key={restaurant.id}
              position={[restaurant.latitude, restaurant.longitude]}
              icon={createCustomIcon(restaurant.category, restaurant.rating)}
              eventHandlers={{
                click: () => onMarkerClick(restaurant)
              }}
            >
              <Popup className="restaurant-popup">
                <div className="popup-content">
                  <img 
                    src={restaurant.images[0] || '/placeholder.jpg'} 
                    alt={restaurant.name}
                    className="popup-image"
                  />
                  <h3 className="popup-title">{restaurant.name}</h3>
                  <div className="popup-meta">
                    <span className="category-tag" style={{ 
                      backgroundColor: categoryColors[restaurant.category] 
                    }}>
                      {restaurant.category}
                    </span>
                    <span className="rating">
                      <Star size={14} fill="#f1c40f" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <div className="popup-details">
                    <p><DollarSign size={14} /> {'¥'.repeat(restaurant.price_level)}</p>
                    <p><Clock size={14} /> {restaurant.opening_hours}</p>
                    <p><MapPin size={14} /> {restaurant.address}</p>
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => onMarkerClick(restaurant)}
                  >
                    查看详情
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* 图例 */}
      <div className="map-legend">
        <h4>类别图例</h4>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }} />
            <span className="legend-label">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
