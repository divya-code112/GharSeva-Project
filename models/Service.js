const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  categoryId: String,
  subCategoryId: String,
  serviceTypeId: String,
  description: String,
  price: Number,
  duration: String,
  image: String,
  packages: [
  {
    name: String,
    price: Number,
    description: String
  }
],
  available: { type: Boolean, default: true } // availability
});

module.exports = mongoose.model('Service', serviceSchema);