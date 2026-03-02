// Mock数据 - 当API不可用时使用
const mockRestaurants = [
  {
    id: '1',
    name: '测试火锅店',
    category: '火锅',
    latitude: 30.5928,
    longitude: 114.3055,
    rating: 4.5,
    price_level: 3,
    tags: ['测试', '火锅', '麻辣'],
    images: [],
    opening_hours: '10:00-22:00',
    review_summary: '这是一家测试用的火锅店',
    address: '武汉市江汉区测试路1号',
    phone: '027-12345678',
    review_count: 100,
    popularity: 500,
    is_open: true
  },
  {
    id: '2',
    name: '测试咖啡厅',
    category: '咖啡',
    latitude: 30.5828,
    longitude: 114.3155,
    rating: 4.2,
    price_level: 2,
    tags: ['测试', '咖啡', '安静'],
    images: [],
    opening_hours: '08:00-20:00',
    review_summary: '这是一家测试用的咖啡厅',
    address: '武汉市武昌区测试路2号',
    phone: '027-87654321',
    review_count: 80,
    popularity: 300,
    is_open: true
  }
];

export default mockRestaurants;
