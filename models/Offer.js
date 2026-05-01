const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true
  },

  discountValue: {
    type: Number,
    required: true
  },

  applicableTo: {
    type: String,
    enum: ["service", "package"],
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package"
  },
couponCode: {
  type: String,
  unique: true,
  required: true
},
  validTill: Date,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);