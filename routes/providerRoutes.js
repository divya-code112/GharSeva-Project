const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../middleware/authMiddleware");
const fs = require("fs");

if (!fs.existsSync("uploads/providers/profile")) {
  fs.mkdirSync("uploads/providers/profile", { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/providers/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* UPDATE BOOKING STATUS */
router.put("/update-status/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === "completed" && !booking.isSettled) {

      const commissionPercent = 10;
      const commission = (booking.totalAmount * commissionPercent) / 100;
      const earning = booking.totalAmount - commission;

      booking.adminCommission = commission;
      booking.providerEarning = earning;
      booking.paymentStatus = "paid";
      booking.isSettled = true;

      await User.findByIdAndUpdate(
        booking.provider,
        { $inc: { walletBalance: earning } }
      );

      await Transaction.create({
        provider: booking.provider,
        amount: earning,
        type: "credit",
        description: "Booking Completed Payment"
      });

      await Notification.create({
        provider: booking.provider,
        message: `₹${earning} credited to your wallet`,
        isRead: false
      });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Status updated", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* REVIEWS */
router.post("/add-review", async (req, res) => {
  try {
    const { providerId, userId, rating, comment } = req.body;

    await Review.create({ provider: providerId, user: userId, rating, comment });

    const reviews = await Review.find({ provider: providerId });

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = reviews.length > 0 ? total / reviews.length : 0;

    await User.findByIdAndUpdate(providerId, {
      rating: avg,
      totalReviews: reviews.length
    });

    res.json({ message: "Review added" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* PROVIDERS BY SERVICE TYPE */
router.get("/by-service-type/:serviceType", async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      serviceType: { $regex: new RegExp(req.params.serviceType, "i") },
      status: "active"
    }).select("-password");

    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* NOTIFICATIONS */
router.get("/notifications/:providerId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      provider: req.params.providerId
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/mark-read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* TRANSACTIONS */
router.get("/transactions/:providerId", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      provider: req.params.providerId
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* BOOKINGS */
router.get("/provider/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.params.providerId
    })
      .populate("client", "name email")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* PROFILE */
router.get("/profile/:id", async (req, res) => {
  try {
    const provider = await User.findById(req.params.id).select("-password");
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-profile/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-photo/:id", upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: req.file.filename },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* WALLET */
router.get("/wallet/:id", async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({
      walletBalance: provider.walletBalance || 0,
      rating: provider.rating || 0,
      totalReviews: provider.totalReviews || 0
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* SINGLE PROVIDER */
router.get("/:id", async (req, res) => {
  try {
    const provider = await User.findById(req.params.id).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;