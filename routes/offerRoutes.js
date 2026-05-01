const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const cron = require("node-cron");

// CREATE OFFER
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      discountType,
      discountValue,
      applicableTo,
      serviceId,
      packageId,
      validTill
    } = req.body;

    const offerData = {
      title,
      description,
      discountType,
      discountValue,
      applicableTo,
      validTill: validTill ? new Date(validTill) : null
    };

    // ✅ Only add serviceId if applicableTo = service
    if (applicableTo === "service" && serviceId) {
      offerData.serviceId = serviceId;
    }

    // ✅ Only add packageId if applicableTo = package
    if (applicableTo === "package" && packageId) {
      offerData.packageId = packageId;
    }

    const offer = new Offer(offerData);
    await offer.save();

    res.status(201).json(offer);

  } catch (err) {
    console.error("Offer Backend Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET ALL OFFERS
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("serviceId")
      .populate("packageId");
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE OFFER
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 AUTO EXPIRE OFFERS (Daily 12 AM)
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const result = await Offer.updateMany(
      {
        validTill: { $lt: now },
        isActive: true
      },
      { $set: { isActive: false } }
    );

    console.log("Expired offers updated:", result.modifiedCount);
  } catch (err) {
    console.error("Cron error:", err);
  }
});


// APPLY COUPON
router.post("/apply", async (req, res) => {
  try {
    const { couponCode, serviceId, packageId, totalAmount } = req.body;

    const offer = await Offer.findOne({
      couponCode,
      isActive: true
    });

    if (!offer) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (offer.validTill < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    // Check applicable type
    if (offer.applicableTo === "service" && offer.serviceId.toString() !== serviceId) {
      return res.status(400).json({ message: "Coupon not applicable for this service" });
    }

    if (offer.applicableTo === "package" && offer.packageId.toString() !== packageId) {
      return res.status(400).json({ message: "Coupon not applicable for this package" });
    }

    let discount = 0;

    if (offer.discountType === "percentage") {
      discount = (totalAmount * offer.discountValue) / 100;
    } else {
      discount = offer.discountValue;
    }

    const finalAmount = totalAmount - discount;

    res.json({
      message: "Coupon applied",
      discount,
      finalAmount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Coupon apply failed" });
  }
});

module.exports = router;