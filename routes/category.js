const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET
router.get('/', async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

// POST
router.post('/', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
});

module.exports = router;