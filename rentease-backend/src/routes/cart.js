const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ user: req.user.id });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, selectedTenure } = req.body;
    
    const product = await Product.findById(productId);
    if (!product || !product.available) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
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

    cart.totalMonthlyRent = cart.items.reduce((sum, item) => sum + (item.monthlyRent * item.quantity), 0);
    cart.totalSecurityDeposit = cart.items.reduce((sum, item) => sum + (item.securityDeposit * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, selectedTenure } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id });
    const item = cart.items.find(item => item.productId.toString() === productId);
    
    if (item) {
      item.quantity = quantity;
      item.selectedTenure = selectedTenure;
    }

    cart.totalMonthlyRent = cart.items.reduce((sum, item) => sum + (item.monthlyRent * item.quantity), 0);
    cart.totalSecurityDeposit = cart.items.reduce((sum, item) => sum + (item.securityDeposit * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    
    cart.totalMonthlyRent = cart.items.reduce((sum, item) => sum + (item.monthlyRent * item.quantity), 0);
    cart.totalSecurityDeposit = cart.items.reduce((sum, item) => sum + (item.securityDeposit * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalMonthlyRent: 0, totalSecurityDeposit: 0 }
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;