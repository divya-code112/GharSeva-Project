const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProviderAvailability = require("../models/ProviderAvailability");
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/authMiddleware");


// ============================================================
// SAVE / UPDATE PROVIDER AVAILABILITY
// ============================================================
router.post("/:providerId", verifyToken, async (req, res) => {
  const { providerId } = req.params;
let { date, timeSlots } = req.body;

  if (!mongoose.Types.ObjectId.isValid(providerId))
    return res.status(400).json({ message: "Invalid providerId" });

  if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0)
    return res.status(400).json({ message: "Date and at least one time slot are required" });

  try {
    const availability = await ProviderAvailability.findOneAndUpdate(
      { providerId, date },
      { timeSlots, isAvailable: true },
      { new: true, upsert: true }
    );

    res.json({ message: "Availability saved successfully", availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save availability" });
  }
});


// ============================================================
// GET AVAILABILITY FOR A DATE
// ============================================================
router.get("/:providerId/:date", verifyToken, async (req, res) => {
  const { providerId, date } = req.params;

  try {
    const availability = await ProviderAvailability.findOne({
      providerId,
      date
    });

    if (!availability) {
      return res.json({ isAvailable: false, timeSlots: [] });
    }

    res.json(availability);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
});


// ============================================================
// UPDATE BOOKING STATUS (Provider Accept / Complete / Cancel)
// ============================================================
router.put("/update-status/:bookingId", verifyToken, async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId))
    return res.status(400).json({ message: "Invalid bookingId" });

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = status;

    // Auto-calculate earnings when completed
    if (status === "completed") {
      const commissionRate = 0.1; // 10%
      booking.adminCommission = booking.totalAmount * commissionRate;
      booking.providerEarning =
        booking.totalAmount - booking.adminCommission;
    }

    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});


module.exports = router;