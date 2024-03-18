const express = require('express');
const SongCategory = require('../models/SongCategory');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await SongCategory.getAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await SongCategory.getById(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add other routes as needed

module.exports = router;
