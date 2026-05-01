// routes/adminUsers.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // normal users model

// GET all users (role: user)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user status (active/blocked)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "blocked"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;