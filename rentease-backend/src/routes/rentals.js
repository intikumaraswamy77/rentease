const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Cart = require('../models/Cart');
const { authMiddleware } = require('../middleware/auth');

// Create rental order
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { deliveryDate, pickupDate, deliveryAddress, notes } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const rental = new Rental({
      user: req.user.id,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.name,
        image: item.image,
        monthlyRent: item.monthlyRent,
        securityDeposit: item.securityDeposit,
        quantity: item.quantity,
        selectedTenure: item.selectedTenure
      })),
      deliveryDate,
      pickupDate,
      deliveryAddress,
      totalAmount: cart.totalMonthlyRent,
      securityDeposit: cart.totalSecurityDeposit,
      status: 'pending'
    });

    await rental.save();
    
    // Clear cart
    cart.items = [];
    cart.totalMonthlyRent = 0;
    cart.totalSecurityDeposit = 0;
    await cart.save();

    res.status(201).json({ message: 'Rental order created', rental });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user rentals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get rental by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user.id });
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel rental
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user.id });
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    if (rental.status === 'active' || rental.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel active rental' });
    }
    rental.status = 'cancelled';
    await rental.save();
    res.json({ message: 'Rental cancelled', rental });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request maintenance
router.post('/:id/maintenance', authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    rental.maintenanceRequests.push({
      description,
      status: 'open',
      createdAt: new Date()
    });
    rental.status = 'maintenance';
    
    await rental.save();
    res.json({ message: 'Maintenance request submitted', rental });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;