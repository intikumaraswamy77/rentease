const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['furniture', 'appliances'] },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  rentalTenureOptions: { type: [Number], required: true }, // [3, 6, 12] months
  specifications: {
    dimensions: String,
    weight: String,
    material: String,
    color: String
  },
  stock: { type: Number, required: true, default: 10 },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);