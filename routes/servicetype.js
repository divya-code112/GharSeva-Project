const express = require('express');
const router = express.Router();
const ServiceType = require('../models/ServiceType');

// ADD
router.post('/', async (req, res) => {
  const data = new ServiceType(req.body);
  await data.save();
  res.json(data);
});

// GET by subcategory
router.get('/:subCategoryId', async (req, res) => {
  const data = await ServiceType.find({
    subCategoryId: req.params.subCategoryId
  });
  res.json(data);
});

module.exports = router;