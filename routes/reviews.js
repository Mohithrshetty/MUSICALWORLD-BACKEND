const express = require('express');
const Review = require('../models/review');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.getAll();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const review = await Review.getById(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add other routes as needed

module.exports = router;
