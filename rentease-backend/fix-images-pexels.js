const products = [
  { name: 'Modern Single Bed', url: 'https://images.pexels.com/photos/3659683/pexels-photo-3659683.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Double Bed with Mattress', url: 'https://images.pexels.com/photos/6480198/pexels-photo-6480198.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: '3-Seater Sofa', url: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Dining Table Set', url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Office Study Table', url: 'https://images.pexels.com/photos/1297611/pexels-photo-1297611.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Wardrobe 3-Door', url: 'https://images.pexels.com/photos/10086976/pexels-photo-10086976.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Double Door Refrigerator', url: 'https://images.pexels.com/photos/2180883/pexels-photo-2180883.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Top Load Washing Machine', url: 'https://images.pexels.com/photos/5591460/pexels-photo-5591460.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'LED Smart TV 32"', url: 'https://images.pexels.com/photos/5721865/pexels-photo-5721865.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Microwave Oven 20L', url: 'https://images.pexels.com/photos/211761/pexels-photo-211761.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Air Cooler 65L', url: 'https://images.pexels.com/photos/3680440/pexels-photo-3680440.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Ceiling Fan 1200mm', url: 'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Premium Velvet Sofa', url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Queen Size Minimalist Bed', url: 'https://images.pexels.com/photos/2053153/pexels-photo-2053153.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Modern Dining Set (4 Seater)', url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Smart Refrigerator 320L', url: 'https://images.pexels.com/photos/12028684/pexels-photo-12028684.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: '4K QLED Smart TV 55"', url: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Front Load Washing Machine 8kg', url: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Ergonomic Gaming Chair', url: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Sony PlayStation 5', url: 'https://images.pexels.com/photos/10708061/pexels-photo-10708061.jpeg?auto=compress&cs=tinysrgb&w=800' }
];

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  for(let p of products) {
    await Product.updateMany({ name: p.name }, { $set: { image: p.url } });
  }
  
  console.log('Fixed URLs with highly relevant Pexels images!');
  process.exit(0);
});
