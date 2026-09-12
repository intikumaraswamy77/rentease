const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
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
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered', 'active', 'maintenance', 'returned', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refund_requested', 'refunded'], default: 'pending' },
  maintenanceRequests: [{
    description: String,
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    createdAt: Date,
    resolvedAt: Date
  }],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);