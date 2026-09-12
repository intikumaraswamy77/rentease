const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rentease_secret_key_2024';

// Use .env MONGODB_URI, fallback to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentease';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB:', MONGODB_URI))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running locally or update MONGODB_URI in .env');
  });

// ============ MODELS ============
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: {
    street: String, city: String, state: String, zipCode: String, country: String
  },
  role: { type: String, enum: ['user', 'admin', 'vendor'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['furniture', 'appliances'], required: true },
  subcategory: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  rentalTenureOptions: { type: [Number], default: [3, 6, 12] },
  specifications: { type: Map, of: String },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    monthlyRent: Number,
    securityDeposit: Number,
    quantity: { type: Number, default: 1 },
    selectedTenure: { type: Number, default: 3 }
  }],
  totalMonthlyRent: { type: Number, default: 0 },
  totalSecurityDeposit: { type: Number, default: 0 }
}, { timestamps: true });
const Cart = mongoose.model('Cart', CartSchema);

const RentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    monthlyRent: Number,
    securityDeposit: Number,
    quantity: Number,
    selectedTenure: Number
  }],
  deliveryDate: { type: Date, required: true },
  pickupDate: { type: Date, required: true },
  deliveryAddress: {
    street: String, city: String, state: String, zipCode: String, country: String
  },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'active', 'maintenance', 'returned', 'cancelled'], default: 'pending' },
  maintenanceRequests: [{
    description: String,
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    createdAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
const Rental = mongoose.model('Rental', RentalSchema);

// ============ MIDDLEWARE ============
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

const vendorMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'vendor') {
    return res.status(403).json({ message: 'Vendor access required' });
  }
  next();
};

// ============ ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, address, role: 'user' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Upgrade to vendor
app.post('/api/auth/become-vendor', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'user') {
      user.role = 'vendor';
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ PRODUCTS ============
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Invalid product ID or server error' });
  }
});

// User listings
app.get('/api/products/me/listings', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products/list', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const productData = { ...req.body, owner: req.user.id };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.owner && product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    // BUG FIX: Check if there are active rentals before deleting
    const activeRentals = await Rental.countDocuments({ 
      'items.productId': req.params.id, 
      status: { $in: ['pending', 'confirmed', 'delivered', 'active', 'maintenance'] }
    });
    
    if (activeRentals > 0) {
      return res.status(400).json({ message: 'Cannot delete product with active rentals. Please mark it as out of stock instead.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ VENDOR MANAGEMENT ============
app.get('/api/vendor/orders', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const vendorProducts = await Product.find({ owner: req.user.id }).select('_id');
    const productIds = vendorProducts.map(p => p._id);
    const rentals = await Rental.find({ 'items.productId': { $in: productIds } }).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/vendor/rentals/:rentalId/maintenance/:requestId', authMiddleware, vendorMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    const request = rental.maintenanceRequests.id(req.params.requestId);
    if (request) {
      request.status = req.body.status;
      await rental.save();
    }
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ CART ============
app.get('/api/cart', authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [], totalMonthlyRent: 0, totalSecurityDeposit: 0 });
  }
  res.json(cart);
});

app.post('/api/cart/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedTenure = 3 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.available) return res.status(400).json({ message: 'Product unavailable' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [], totalMonthlyRent: 0, totalSecurityDeposit: 0 });

    const existingItem = cart.items.find(i => i.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.selectedTenure = selectedTenure;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        image: product.image,
        monthlyRent: product.monthlyRent,
        securityDeposit: product.securityDeposit,
        quantity,
        selectedTenure
      });
    }

    cart.totalMonthlyRent = cart.items.reduce((s, i) => s + i.monthlyRent * i.quantity, 0);
    cart.totalSecurityDeposit = cart.items.reduce((s, i) => s + i.securityDeposit * i.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/cart/clear', authMiddleware, async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], totalMonthlyRent: 0, totalSecurityDeposit: 0 });
  res.json({ message: 'Cart cleared' });
});

// ============ WISHLIST ============
app.get('/api/wishlist', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/wishlist/toggle', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.wishlist = user.wishlist.filter(Boolean); // clean up any nulls
    const index = user.wishlist.findIndex(id => id && id.toString() === productId.toString());
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }
    
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ RENTALS ============
app.post('/api/rentals/create', authMiddleware, async (req, res) => {
  try {
    const { deliveryDate, pickupDate, deliveryAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const rental = await Rental.create({
      user: req.user.id,
      items: cart.items,
      deliveryDate,
      pickupDate,
      deliveryAddress,
      totalAmount: cart.totalMonthlyRent,
      securityDeposit: cart.totalSecurityDeposit,
      status: 'pending'
    });

    // Clear cart
    cart.items = [];
    cart.totalMonthlyRent = 0;
    cart.totalSecurityDeposit = 0;
    await cart.save();

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/rentals', authMiddleware, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/rentals/:id', authMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user.id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: 'Invalid rental ID' });
  }
});

app.post('/api/rentals/:id/maintenance', authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user.id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.maintenanceRequests.push({ description, status: 'open', createdAt: new Date() });
    if (rental.status !== 'maintenance') rental.status = 'maintenance';
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/rentals/:id/cancel', authMiddleware, async (req, res) => {
  const rental = await Rental.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id, status: { $in: ['pending', 'confirmed'] } },
    { status: 'cancelled' },
    { new: true }
  );
  if (!rental) return res.status(400).json({ message: 'Cannot cancel this rental' });
  res.json({ message: 'Rental cancelled', rental });
});

// ============ ADMIN ============
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRentals = await Rental.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const pendingRentals = await Rental.countDocuments({ status: 'pending' });
    const revenue = await Rental.aggregate([
      { $match: { status: { $in: ['active', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({ totalUsers, totalProducts, totalRentals, activeRentals, pendingRentals, monthlyRevenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/rentals', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const rentals = await Rental.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(rentals);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.put('/api/admin/rentals/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(rental);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.get('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.post('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.put('/api/admin/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch(err) { res.status(500).json({ message: err.message }) }
});

app.put('/api/admin/rentals/:rentalId/maintenance/:requestId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    const request = rental.maintenanceRequests.id(req.params.requestId);
    if (request) {
      request.status = req.body.status;
      await rental.save();
    }
    res.json(rental);
  } catch(err) { res.status(500).json({ message: err.message }) }
});

// ============ HEALTH ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});