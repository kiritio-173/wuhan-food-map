import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, List, Grid, Moon, Sun, Navigation, Plus } from 'lucide-react';
import MapComponent from './components/MapComponent';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import FilterPanel from './components/FilterPanel';
import AddRestaurantModal from './components/AddRestaurantModal';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    minRating: 0,
    maxPrice: 5,
    keyword: '',
    sortBy: 'rating'
  });

  // 获取餐厅数据
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 应用筛选
  useEffect(() => {
    applyFilters();
  }, [restaurants, filters]);

  // 深色模式
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/restaurants`);
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.data);
      }
    } catch (error) {
      console.error('获取餐厅数据失败:', error);
      // 使用模拟数据
      import('./data/mockData').then(module => {
        setRestaurants(module.default || []);
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...restaurants];

    // 类别筛选
    if (filters.category) {
      result = result.filter(r => r.category === filters.category);
    }

    // 评分筛选
    if (filters.minRating > 0) {
      result = result.filter(r => r.rating >= filters.minRating);
    }

    // 价格筛选
    if (filters.maxPrice < 5) {
      result = result.filter(r => r.price_level <= filters.maxPrice);
    }

    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(keyword) ||
        r.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
        r.address.toLowerCase().includes(keyword)
      );
    }

    // 排序
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price_level - b.price_level;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(result);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('获取位置失败:', error);
          alert('无法获取您的位置，请检查定位权限');
        }
      );
    } else {
      alert('您的浏览器不支持地理定位');
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewMode('map');
  };

  const handleAddRestaurant = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
    setFilteredRestaurants([...filteredRestaurants, newRestaurant]);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* 头部导航 */}
      <header className="header">
        <div className="header-left">
          <MapPin className="logo-icon" />
          <h1 className="app-title">武汉美食地图</h1>
        </div>
        
        <div className="header-center">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="搜索餐厅、类别、标签..."
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
          </div>
        </div>

        <div className="header-right">
          <button 
            className="icon-btn add-btn"
            onClick={() => setShowAddModal(true)}
            title="添加餐厅"
          >
            <Plus size={20} />
          </button>
          
          <button 
            className="icon-btn"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter size={20} />
          </button>
          
          <button 
            className="icon-btn"
            onClick={getUserLocation}
            title="定位到我的位置"
          >
            <Navigation size={20} />
          </button>
          
          <button 
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="view-toggle">
            <button 
              className={viewMode === 'map' ? 'active' : ''}
              onClick={() => setViewMode('map')}
            >
              <MapPin size={18} />
              地图
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
              列表
            </button>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="main-content">
        {/* 筛选面板 */}
        {showFilterPanel && (
          <FilterPanel 
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilterPanel(false)}
          />
        )}

        {/* 地图视图 */}
        {viewMode === 'map' && (
          <div className="map-view">
            <MapComponent
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onRestaurantClick={handleRestaurantClick}
              userLocation={userLocation}
              filters={filters}
            />
            
            {/* 侧边栏列表（地图模式下显示） */}
            <div className="sidebar">
              <div className="sidebar-header">
                <h2>附近餐厅 ({filteredRestaurants.length})</h2>
              </div>
              <div className="sidebar-content">
                <RestaurantList 
                  restaurants={filteredRestaurants.slice(0, 10)}
                  onItemClick={handleRestaurantClick}
                  selectedId={selectedRestaurant?.id}
                />
              </div>
              {/* 选中餐厅详情面板 */}
              {selectedRestaurant && (
                <div className="sidebar-detail">
                  <div className="detail-header">
                    <h3>{selectedRestaurant.name}</h3>
                    <button className="close-detail" onClick={() => setSelectedRestaurant(null)}>×</button>
                  </div>
                  <div className="detail-info">
                    <p>📍 {selectedRestaurant.address}</p>
                    <p>📞 {selectedRestaurant.phone || '暂无'}</p>
                    <p>🕐 {selectedRestaurant.opening_hours || '暂无'}</p>
                  </div>
                  <div className="detail-rating">
                    <span className="stars">⭐ {selectedRestaurant.rating}</span>
                    <span className="price">{'¥'.repeat(selectedRestaurant.price_level || 1)}</span>
                    <span>👀 {selectedRestaurant.popularity || 0}</span>
                  </div>
                  <div className="detail-tags">
                    {selectedRestaurant.tags && selectedRestaurant.tags.map(function(tag, i) {
                      return React.createElement('span', { key: i, className: 'detail-tag' }, tag);
                    })}
                  </div>
                  <p className="detail-summary">{selectedRestaurant.review_summary || '暂无简介'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="list-view">
            <RestaurantList 
              restaurants={filteredRestaurants}
              onItemClick={handleRestaurantClick}
              layout="grid"
            />
          </div>
        )}
      </main>

      {/* 详情弹窗 */}
      {selectedRestaurant && (
        <RestaurantDetail 
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRestaurant}
        />
      )}

      {/* 统计信息 */}
      <footer className="footer">
        <span>共收录 {restaurants.length} 家餐厅</span>
        <span>当前显示 {filteredRestaurants.length} 家</span>
      </footer>
    </div>
  );
}

export default App;
