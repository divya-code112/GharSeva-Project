const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all providers
router.get("/", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE provider status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "blocked", "pending"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "provider" },
      { status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Provider not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE provider
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "provider",
    });

    if (!deleted)
      return res.status(404).json({ error: "Provider not found" });

    res.json({ message: "Provider deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;