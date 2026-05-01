const express = require('express');
const router = express.Router();
const SubCategory = require('../models/SubCategory');

// ADD
router.post('/', async (req, res) => {
  const sub = new SubCategory(req.body);
  await sub.save();
  res.json(sub);
});

// GET by category
router.get('/:categoryId', async (req, res) => {
  const data = await SubCategory.find({
    categoryId: req.params.categoryId
  });
  res.json(data);
});

module.exports = router;