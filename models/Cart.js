const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      serviceId: String,
      providerId: String,
      name: String,
      price: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);