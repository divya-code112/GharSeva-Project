const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// Get services by serviceType
router.get("/by-type/:serviceTypeId", async (req, res) => {
  try {
    const services = await Service.find({
      serviceTypeId: req.params.serviceTypeId,
      available: true
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

module.exports = router;