import React from 'react';
import { X, Star, DollarSign } from 'lucide-react';
import './FilterPanel.css';

const categories = ['全部', '火锅', '日料', '咖啡', '夜宵', '烧烤', '湖北菜', '小吃', '西餐', '奶茶', '自助餐'];

const FilterPanel = ({ filters, setFilters, onClose }) => {
  const handleCategoryClick = (category) => {
    setFilters({
      ...filters,
      category: category === '全部' ? '' : category
    });
  };

  const handleClear = () => {
    setFilters({
      category: '',
      minRating: 0,
      maxPrice: 5,
      keyword: '',
      sortBy: 'rating'
    });
  };

  return (
    <div className="filter-panel-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={e => e.stopPropagation()}>
        <div className="filter-header">
          <h3>筛选条件</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="filter-content">
          {/* 类别筛选 */}
          <div className="filter-section">
            <h4>餐厅类别</h4>
            <div className="category-tags">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-tag ${filters.category === cat || (filters.category === '' && cat === '全部') ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 评分筛选 */}
          <div className="filter-section">
            <h4>最低评分</h4>
            <div className="rating-filters">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  className={`rating-btn ${filters.minRating === rating ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, minRating: rating})}
                >
                  {rating === 0 ? '全部' : (
                    <>
                      <Star size={14} fill="currentColor" />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 价格筛选 */}
          <div className="filter-section">
            <h4>价格区间</h4>
            <div className="price-filters">
              {[1, 2, 3, 4, 5].map(price => (
                <button
                  key={price}
                  className={`price-btn ${filters.maxPrice === price ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, maxPrice: price})}
                >
                  <DollarSign size={14} />
                  {'¥'.repeat(price)}
                </button>
              ))}
            </div>
          </div>

          {/* 排序方式 */}
          <div className="filter-section">
            <h4>排序方式</h4>
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="sort-select"
            >
              <option value="rating">评分最高</option>
              <option value="popularity">人气最高</option>
              <option value="price">价格最低</option>
            </select>
          </div>
        </div>

        <div className="filter-footer">
          <button className="clear-btn" onClick={handleClear}>
            清除全部
          </button>
          <button className="apply-btn" onClick={onClose}>
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
