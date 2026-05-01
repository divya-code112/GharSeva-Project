const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subcategory"
},

  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);