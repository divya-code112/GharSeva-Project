const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: String,
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);