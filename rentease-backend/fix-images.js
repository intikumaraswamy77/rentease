const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const products = await Product.find({});
  for(let p of products) {
    const keyword = encodeURIComponent(p.subcategory || p.category || 'furniture');
    p.image = 'https://loremflickr.com/800/600/' + keyword + '?lock=' + p._id.toString().substring(18);
    await Product.updateOne({ _id: p._id }, { $set: { image: p.image } });
  }
  console.log('Fixed ALL URLs to reliable LoremFlickr images!');
  process.exit(0);
});
