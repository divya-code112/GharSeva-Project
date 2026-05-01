const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});
const upload = multer({ storage });

/*// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;

    let filter = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const services = await Service.find(filter);
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD service
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, categoryId, subCategoryId, serviceTypeId, description, price, duration, available } = req.body;

    const newService = new Service({
      name,
      categoryId,
      subCategoryId,
      serviceTypeId,
      description,
      price,
      duration,
      available: available === 'true' || available === true,
      image: req.file ? req.file.filename : null
    });

    const saved = await newService.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE service
router.put('/:id', async (req, res) => {
  try {
    const { name, price, categoryId, subCategoryId, serviceTypeId, description, duration, available } = req.body;

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(categoryId !== undefined && { categoryId }),
        ...(subCategoryId !== undefined && { subCategoryId }),
        ...(serviceTypeId !== undefined && { serviceTypeId }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration }),
        ...(available !== undefined && { available: available === 'true' || available === true })
      },
      { returnDocument: 'after' }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET SINGLE SERVICE
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;