const mongoose = require("mongoose");

const providerAvailabilitySchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },
  date: {
  type: String,
  required: true
},
  isAvailable: {
    type: Boolean,
    default: true
  },
  timeSlots: [String]
}, { timestamps: true });

module.exports = mongoose.model("ProviderAvailability", providerAvailabilitySchema);