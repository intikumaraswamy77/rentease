const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/rentease').then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  await User.updateMany({}, { $set: { password: hashedPassword } });
  
  console.log('All passwords successfully reset to password123!');
  process.exit(0);
});
