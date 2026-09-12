const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentease';
mongoose.connect(uri).then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  const admin = await User.findOne({ role: 'admin' }) || await User.findOne();
  
  const products = [
    {
      name: 'Premium Velvet Sofa', category: 'furniture', subcategory: 'Living Room',
      description: 'Luxurious 3-seater velvet sofa with plush cushions.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 1200, securityDeposit: 2000, rentalTenureOptions: [3, 6, 12],
      stock: 5, available: true, rating: 4.8, reviews: 24, owner: admin?._id
    },
    {
      name: 'Queen Size Minimalist Bed', category: 'furniture', subcategory: 'Bedroom',
      description: 'Sleek wooden frame queen size bed with orthopedic mattress.',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 950, securityDeposit: 1500, rentalTenureOptions: [3, 6, 12],
      stock: 3, available: true, rating: 4.9, reviews: 42, owner: admin?._id
    },
    {
      name: 'Modern Dining Set (4 Seater)', category: 'furniture', subcategory: 'Dining',
      description: 'Contemporary glass top dining table with 4 cushioned chairs.',
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 1500, securityDeposit: 3000, rentalTenureOptions: [6, 12],
      stock: 2, available: true, rating: 4.7, reviews: 18, owner: admin?._id
    },
    {
      name: 'Smart Refrigerator 320L', category: 'appliances', subcategory: 'Kitchen',
      description: 'Energy-efficient frost-free refrigerator with smart cooling.',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 800, securityDeposit: 1500, rentalTenureOptions: [3, 6, 12],
      stock: 4, available: true, rating: 4.6, reviews: 31, owner: admin?._id
    },
    {
      name: '4K QLED Smart TV 55"', category: 'appliances', subcategory: 'Living Room',
      description: 'Stunning 55-inch 4K QLED Smart TV with built-in voice assistant.',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 1100, securityDeposit: 2500, rentalTenureOptions: [3, 6, 12],
      stock: 6, available: true, rating: 4.9, reviews: 56, owner: admin?._id
    },
    {
      name: 'Front Load Washing Machine 8kg', category: 'appliances', subcategory: 'Laundry',
      description: 'Fully automatic front load washing machine with heater.',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      monthlyRent: 900, securityDeposit: 1800, rentalTenureOptions: [3, 6, 12],
      stock: 3, available: true, rating: 4.5, reviews: 29, owner: admin?._id
    }
  ];
  
  for(let p of products) {
     await Product.create(p);
  }
  console.log('Seeded products!');
  process.exit(0);
});