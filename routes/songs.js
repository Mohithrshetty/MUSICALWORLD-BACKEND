const express = require('express');
const Song = require('../models/song');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const songs = await Song.getAll();
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const song = await Song.getById(req.params.id);
    if (!song) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add other routes as needed



module.exports = router;
