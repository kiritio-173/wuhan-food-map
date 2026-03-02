import React, { useState } from 'react';
import { Plus, X, MapPin, Upload } from 'lucide-react';
import './AddRestaurantModal.css';

const categories = ['火锅', '日料', '咖啡', '夜宵', '烧烤', '湖北菜', '小吃', '西餐', '奶茶', '自助餐'];

const AddRestaurantModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '火锅',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
    rating: 4.0,
    price_level: 2,
    tags: '',
    opening_hours: '',
    review_summary: '',
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          alert('无法获取位置，请手动输入');
        }
      );
    } else {
      alert('浏览器不支持地理定位');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 处理tags字符串为数组
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        rating: parseFloat(formData.rating),
        price_level: parseInt(formData.price_level),
        review_count: 0,
        popularity: 0,
        is_open: true
      };

      const response = await fetch('http://localhost:3001/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });

      const result = await response.json();

      if (result.success) {
        onAdd(result.data);
        onClose();
        alert('餐厅添加成功！');
      } else {
        setError(result.error || '添加失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>添加新餐厅</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label>餐厅名称 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="输入餐厅名称"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>类别 *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>评分</label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>价格等级</label>
              <select name="price_level" value={formData.price_level} onChange={handleChange}>
                <option value={1}>¥ 便宜</option>
                <option value={2}>¥¥ 适中</option>
                <option value={3}>¥¥¥ 稍贵</option>
                <option value={4}>¥¥¥¥ 高端</option>
                <option value={5}>¥¥¥¥¥ 豪华</option>
              </select>
            </div>

            <div className="form-group">
              <label>营业时间</label>
              <input
                type="text"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                placeholder="如: 10:00-22:00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>地址 *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="输入详细地址"
              required
            />
          </div>

          <div className="form-group">
            <label>联系电话</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="输入电话号码"
            />
          </div>

          <div className="form-group location-group">
            <label>坐标位置 *</label>
            <div className="location-inputs">
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="纬度"
                step="any"
                required
              />
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="经度"
                step="any"
                required
              />
              <button type="button" className="location-btn" onClick={handleGetLocation}>
                <MapPin size={16} />
                获取当前位置
              </button>
            </div>
            <small className="hint">提示：可以在地图上点击选择位置</small>
          </div>

          <div className="form-group">
            <label>标签（用逗号分隔）</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="如: 网红, 排队王, 适合聚餐"
            />
          </div>

          <div className="form-group">
            <label>评价摘要</label>
            <textarea
              name="review_summary"
              value={formData.review_summary}
              onChange={handleChange}
              placeholder="简要描述餐厅特色和口碑"
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '添加中...' : '添加餐厅'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
