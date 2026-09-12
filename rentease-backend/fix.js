const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Find all products and fix the URL string by replacing 'auto=format=crop' with 'auto=format&fit=crop'
  const products = await Product.find({});
  for(let p of products) {
    if (p.image && p.image.includes('auto=format=crop')) {
      p.image = p.image.replace('auto=format=crop', 'auto=format&fit=crop');
      await Product.updateOne({ _id: p._id }, { $set: { image: p.image } });
    }
  }
  console.log('Fixed URLs!');
  process.exit(0);
});
