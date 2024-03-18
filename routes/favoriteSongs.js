const express = require('express');
const FavoriteSong = require('../models/favouritesong');

const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const favoriteSongs = await FavoriteSong.getAll();
    res.json(favoriteSongs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const favoriteSong = await FavoriteSong.getById(req.params.id);
    if (!favoriteSong) {
      res.status(404).json({ error: 'Favorite song not found' });
      return;
    }
    res.json(favoriteSong);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
