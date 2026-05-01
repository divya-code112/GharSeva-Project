const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const ProviderAvailability = require("../models/ProviderAvailability");
const Service = require("../models/Service");
const Package = require("../models/Package");
const { verifyToken } = require("../middleware/authMiddleware");

/* ======================================================
   CREATE BOOKING
====================================================== */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      providerId,
      serviceId,
      packageId,
      date,
      timeSlot,
      paymentMethod
    } = req.body;

    if (!providerId || !date || !timeSlot || !serviceId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check availability
    const availability = await ProviderAvailability.findOne({
      providerId,
      date
    });

    if (!availability || !availability.timeSlots?.includes(timeSlot)) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Get service price
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let basePrice = service.price || 0;

    // Package override
    if (packageId) {
      const pkg = await Package.findById(packageId);
      if (pkg) {
        basePrice = pkg.totalPrice || basePrice;
      }
    }

    basePrice = Number(basePrice);

    const totalAmount = basePrice;
    const advanceAmount = basePrice > 1000 ? basePrice * 0.3 : 0;

    const normalizedPayment =
      paymentMethod === "cash" ? "cod" : paymentMethod;

    if (basePrice > 1000 && normalizedPayment === "cod") {
      return res.status(400).json({
        message: "COD not allowed above ₹1000"
      });
    }

    const booking = await Booking.create({
      client: req.user.id,
      provider: providerId,
      service: serviceId,
      package: packageId || null,
      bookingDate: date,
      timeSlot,
      totalAmount,
      finalAmount: basePrice,
      advanceAmount,
      paymentMethod: normalizedPayment,
      paymentStatus: basePrice > 1000 ? "paid" : "pending",
      status: "pending"
    });

    // Remove slot after booking
    availability.timeSlots = availability.timeSlots.filter(
      (s) => s !== timeSlot
    );

    await availability.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({
      message: "Booking failed",
      error: err.message
    });
  }
});

/* ======================================================
   USER BOOKINGS
====================================================== */
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const { status, dateRange } = req.query;

    let filter = { client: req.user.id };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (dateRange) {
      const now = new Date();
      let startDate = null;

      if (dateRange === "today") {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      }

      if (dateRange === "7days") {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
      }

      if (dateRange === "month") {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
      }

      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    const bookings = await Booking.find(filter)
      .populate("provider", "name email")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/* ======================================================
   PROVIDER BOOKINGS
====================================================== */
router.get("/provider/:providerId", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.params.providerId
    })
      .populate("client", "name email")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
});

/* ======================================================
   UPDATE STATUS
====================================================== */
router.put("/update-status/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Updated", booking });

  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

/* ======================================================
   CANCEL BOOKING (FIXED)
====================================================== */
router.put("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel after acceptance"
      });
    }

    const created = new Date(booking.createdAt);
    const now = new Date();
    const diffMinutes = (now - created) / (1000 * 60);

    if (diffMinutes > 30) {
      return res.status(400).json({
        message: "Cancel window expired (30 min)"
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cancel failed" });
  }
});

module.exports = router;