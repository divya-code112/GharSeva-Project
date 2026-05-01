const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "provider", "user"],
    default: "user"
  },
  services: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Service"
}],

  phone: String,
  serviceType: String,
  experience: Number,
  aadhaarNumber: String,

  idProofImage: String,
  certificateImage: String,
  profilePhoto: String,

rating: { type: Number, default: 0 },
totalReviews: { type: Number, default: 0 },
walletBalance: { type: Number, default: 0 },

  otp: String,
  otpExpires: Date,

  isVerified: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["pending", "active", "blocked"],
    default: "active"
  },
  resetPasswordToken: String,
resetPasswordExpire: Date,

}, { timestamps: true });

userSchema.index({role: 1, serviceType: 1});
module.exports = mongoose.model("User", userSchema);