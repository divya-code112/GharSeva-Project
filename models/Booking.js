const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package"
    },

    offerApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer"
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    bookingDate: String,
    timeSlot: String,

    totalAmount: {
      type: Number,
      default: 0
    },

    finalAmount: {
      type: Number,
      default: 0
    },

    advanceAmount: {
      type: Number,
      default: 0
    },

    paymentMethod: String,
    paymentStatus: {
      type: String,
      default: "pending"
    },

    providerEarning: {
      type: Number,
      default: 0
    },

    adminCommission: {
      type: Number,
      default: 0
    },

    isSettled: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);