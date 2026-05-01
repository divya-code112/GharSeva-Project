const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// CREATE PACKAGE
router.post("/", async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PACKAGES
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().populate("services");
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;