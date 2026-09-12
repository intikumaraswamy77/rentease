const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const updates = [
    { name: 'Modern Single Bed', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format=crop&w=800&q=80' },
    { name: 'Double Bed with Mattress', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format=crop&w=800&q=80' },
    { name: '3-Seater Sofa', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format=crop&w=800&q=80' },
    { name: 'Dining Table Set', image: 'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format=crop&w=800&q=80' },
    { name: 'Office Study Table', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format=crop&w=800&q=80' },
    { name: 'Wardrobe 3-Door', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format=crop&w=800&q=80' },
    { name: 'Double Door Refrigerator', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format=crop&w=800&q=80' },
    { name: 'Top Load Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format=crop&w=800&q=80' },
    { name: 'LED Smart TV 32"', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format=crop&w=800&q=80' },
    { name: 'Microwave Oven 20L', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format=crop&w=800&q=80' },
    { name: 'Air Cooler 65L', image: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?auto=format=crop&w=800&q=80' },
    { name: 'Ceiling Fan 1200mm', image: 'https://images.unsplash.com/photo-1588628566587-bf68032cebd6?auto=format=crop&w=800&q=80' }
  ];
  
  for(let u of updates) {
     await Product.updateOne({ name: u.name }, { $set: { image: u.image } });
  }
  
  // Let's add a couple more creative, high-end products
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const admin = await User.findOne({ role: 'admin' }) || await User.findOne();
  
  const newProducts = [
    {
      name: 'Ergonomic Gaming Chair', category: 'furniture', subcategory: 'Office',
      description: 'High-end ergonomic chair with lumbar support.',
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format=crop&w=800&q=80',
      monthlyRent: 400, securityDeposit: 1000, rentalTenureOptions: [3, 6, 12],
      stock: 10, available: true, rating: 4.9, reviews: 120, owner: admin?._id
    },
    {
      name: 'Sony PlayStation 5', category: 'appliances', subcategory: 'Gaming',
      description: 'Next-gen gaming console.',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format=crop&w=800&q=80',
      monthlyRent: 1500, securityDeposit: 5000, rentalTenureOptions: [1, 3, 6],
      stock: 2, available: true, rating: 5.0, reviews: 300, owner: admin?._id
    }
  ];
  
  for(let p of newProducts) {
     await Product.create(p);
  }

  console.log('Updated existing images and added creative products!');
  process.exit(0);
});
