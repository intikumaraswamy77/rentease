const products = [
  { name: 'Modern Single Bed', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800' },
  { name: 'Double Bed with Mattress', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800' },
  { name: '3-Seater Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { name: 'Dining Table Set', url: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=800' },
  { name: 'Office Study Table', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wardrobe 3-Door', url: 'https://images.unsplash.com/photo-1595526114101-11910609a63c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Double Door Refrigerator', url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800' },
  { name: 'Top Load Washing Machine', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800' },
  { name: 'LED Smart TV 32"', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Microwave Oven 20L', url: 'https://images.unsplash.com/photo-1585659722983-39cb3ee870f7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Air Cooler 65L', url: 'https://images.unsplash.com/photo-1601614945722-1d54e5349e59?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ceiling Fan 1200mm', url: 'https://images.unsplash.com/photo-1616422285623-13838dc2a048?auto=format&fit=crop&q=80&w=800' },
  { name: 'Premium Velvet Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Queen Size Minimalist Bed', url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Modern Dining Set (4 Seater)', url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Smart Refrigerator 320L', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80' },
  { name: '4K QLED Smart TV 55"', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Front Load Washing Machine 8kg', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ergonomic Gaming Chair', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sony PlayStation 5', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80' }
];

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  for(let p of products) {
    await Product.updateMany({ name: p.name }, { $set: { image: p.url } });
  }
  
  console.log('Restored the original high-quality Unsplash images!');
  process.exit(0);
});
