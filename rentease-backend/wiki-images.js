async function getWikiImage(title) {
  try {
    const res = await fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=' + encodeURIComponent(title));
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].original ? pages[pageId].original.source : null;
  } catch(e) { return null; }
}

async function run() {
  const images = {
    'Modern Single Bed': await getWikiImage('Bed'),
    'Double Bed with Mattress': await getWikiImage('Bed'),
    '3-Seater Sofa': await getWikiImage('Couch'),
    'Premium Velvet Sofa': await getWikiImage('Couch'),
    'Queen Size Minimalist Bed': await getWikiImage('Bed'),
    'Dining Table Set': await getWikiImage('Table_(furniture)'),
    'Modern Dining Set (4 Seater)': await getWikiImage('Table_(furniture)'),
    'Office Study Table': await getWikiImage('Desk'),
    'Wardrobe 3-Door': await getWikiImage('Wardrobe'),
    'Double Door Refrigerator': await getWikiImage('Refrigerator'),
    'Smart Refrigerator 320L': await getWikiImage('Refrigerator'),
    'Top Load Washing Machine': await getWikiImage('Washing_machine'),
    'Front Load Washing Machine 8kg': await getWikiImage('Washing_machine'),
    'LED Smart TV 32"': await getWikiImage('Television_set'),
    '4K QLED Smart TV 55"': await getWikiImage('Television_set'),
    'Microwave Oven 20L': await getWikiImage('Microwave_oven'),
    'Air Cooler 65L': await getWikiImage('Evaporative_cooler'),
    'Ceiling Fan 1200mm': await getWikiImage('Ceiling_fan'),
    'Ergonomic Gaming Chair': await getWikiImage('Office_chair'),
    'Sony PlayStation 5': await getWikiImage('PlayStation_5')
  };
  
  const mongoose = require('mongoose');
  await mongoose.connect('mongodb://127.0.0.1:27017/rentease');
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  for (const [name, url] of Object.entries(images)) {
    if (url) {
      await Product.updateMany({ name }, { $set: { image: url } });
    }
  }
  
  console.log('Fixed URLs with real Wikipedia images!');
  process.exit(0);
}
run();
