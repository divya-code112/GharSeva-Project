// routes/admin.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

/* ============================
   EMAIL CONFIG
============================ */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================================
   =============== PROVIDER MANAGEMENT =====================
========================================================= */

// ✅ GET ALL PROVIDERS
router.get("/providers", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ APPROVE / BLOCK PROVIDER
router.put("/providers/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.status = status;
    await provider.save();

    // ✅ Send email when approved
    if (status === "active") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: provider.email,
        subject: "Provider Approved ✅",
        text: `Hello ${provider.name}, your provider account has been approved. You can now login.`,
      });
    }

    res.json({ message: "Provider status updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE PROVIDER
router.delete("/providers/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "provider",
    });

    if (!deleted)
      return res.status(404).json({ message: "Provider not found" });

    res.json({ message: "Provider deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   ================= USER MANAGEMENT =======================
========================================================= */

// ✅ GET ALL NORMAL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ BLOCK / ACTIVATE USER
router.put("/users/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id, role: "user" },
      { status },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      _id: req.params.id,
      role: "user",
    });

    if (!deletedUser)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const Booking = require("../models/Booking");

router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});





module.exports = router;