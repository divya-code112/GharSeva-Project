const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");

/* ================= ADD TO CART ================= */
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { serviceId, providerId, price, name } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ serviceId, providerId, price, name }],
      });
    } else {
      cart.items.push({ serviceId, providerId, price, name });
    }

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET CART ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= REMOVE ITEM ================= */
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;