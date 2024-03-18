const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await new Promise((resolve, reject) => {
      db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
    res.send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
});


// app.post('/login', (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = users.find(u => u.email === email);

//     // Check if user exists and password is correct
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Here you might generate a JWT token for authentication

//     // Return a success message or token
//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     console.error('Error logging in:', error.message);
//     res.status(500).json({ message: 'An error occurred' });
//   }
// })

// Add other routes as needed

module.exports = router;
