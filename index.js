const mysql = require('mysql');

//mysql database connection

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: ''
  });

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
  module.exports = db;
});



//express connections
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const classToPlain = require('class-transformer');

const cookieParser = require("cookie-parser")
const multer = require('multer');
const path = require('path')
const upload = require("./routes/uploads")

const secretKey = 'hi';




app.use(cookieParser());
//to store images and musics in backend folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/images/');
    } else if (file.fieldname === 'file') {
      cb(null, 'uploads/musics/');
    } else {
      cb({ message: 'Invalid file field' }, false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});






function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Authorization denied' });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;



app.use(cors())
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const rolesRouter = require('./routes/roles');
const usersRouter = require('./routes/users');
const songCategoriesRouter = require('./routes/songCategories');
const songsRouter = require('./routes/songs');
const favoriteSongsRouter = require('./routes/favoriteSongs');
const reviewsRouter = require('./routes/reviews');
// const router = require('./routes/roles');




app.use('/routes/roles', rolesRouter);
app.use('/routes/users', usersRouter);
app.use('/routes/songCategories', songCategoriesRouter);
app.use('/routes/songs', songsRouter);
app.use('/routes/favoriteSongs', favoriteSongsRouter);
app.use('/routes/reviews', reviewsRouter);




// Get all users
app.get('/users', async (req, res) => {
  try {
    db.query('SELECT * FROM users',  (err, results) => {
      if (err) {
        throw err;
      }
      res.json(results);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('NO USERS  FOUND');
  }
});






app.post('/users', async (req, res) => {
  try {
    const { role_id, first_name, last_name, email_address, phone_number, password } = req.body;
    await db.query('INSERT INTO users (role_id, first_name, last_name, email_address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)', [role_id, first_name, last_name, email_address, phone_number, password]);
    res.send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});



// Update a user by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { role_id, first_name, last_name, email_address, phone_number, password } = req.body;
  db.query('UPDATE users SET role_id = ?, first_name = ?, last_name = ?, email_address = ?, phone_number = ?, password = ? WHERE id = ?', [role_id, first_name, last_name, email_address, phone_number, password, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating user');
      return;
    }
    res.send('User updated successfully');
  });
});



app.post('/login', (req, res) => {
  const { email_address, password } = req.body;

  console.log('Received login request with email address:', email_address);

  db.query('SELECT  * FROM users WHERE email_address = ?', [email_address], (err, user) => {
    if (err) {
      console.error('Error in login request:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    console.log('Found user:', user);

    if (!user || user.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const foundUser = user[0]; // Assuming the first user in the result is the correct one

    console.log('Found user ID:', foundUser.id);
    

    // Compare the provided password with the stored password
    if (password !== foundUser.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: foundUser.id,
        email_address: foundUser.email_address,
        first_name:foundUser.first_name
      }
    };

    jwt.sign(payload, 'hi', { expiresIn: '2h' }, (err, token) => {
      if (err) {
        console.error('Error generating JWT token:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
}

      console.log('Generated JWT token:', token);

      // Return the token with a 200 status code
      res.status(200).json({ token });
    });
  });
});







// Example: Protecting a route
app.get('/login', auth, (req, res) => {
  res.json({ message: 'Access granted' });
});












       




// Delete a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting user');
      return;
    }
    res.send('User deleted successfully');
  });
});








// Get all reviews
app.get('/reviews', (req, res) => {
  db.query('SELECT * FROM reviews', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching reviews');
      return;
    }
    res.json(results);
  });
});


// Update a review by id
app.put('/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { stars, description, user_id } = req.body;
  db.query('UPDATE reviews SET stars = ?, description = ?, user_id = ? WHERE id = ?', [stars, description, user_id, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating review');
      return;
    }
    res.send('Review updated successfully');
  });
});

// Delete a review by id
app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reviews WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting review');
      return;
    }
    res.send('Review deleted successfully');
  });
});







  

//for songs uploading


// Set up a route for file uploads


app.post('/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category_id, user_id } = req.body;
    const musicFile = req.files['file'][0];
    const thumbnailFile = req.files['thumbnail'][0];

    if (!musicFile || !thumbnailFile || !title || !description || !category_id || !user_id) {
      return res.status(400).json({ message: 'Please provide all the required information' });
    }

    const sql = 'INSERT INTO songs (category_id, user_id, title, thumbnail, music_file, description) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(sql, [category_id, user_id, title, thumbnailFile.originalname, musicFile.originalname, description]);

    res.status(200).json({ message: 'Song uploaded Succesfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload song' });
  }
});

//to display songs



// Backend route to fetch songs
app.get('/songs', async (req, res) => {
  try {
    const sql = 'SELECT * FROM songs';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch songs' });
        return;
      }
      res.json(results);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});


//delete a song by id 

app.delete('/songs/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM songs WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting song');
      return;
    }
    res.send('Song deleted successfully');
  });
});


//favorite songs







// Remove from favorites
app.delete('/favorite_songs/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM favorite_songs WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to remove from favorites');
      return;
    }
    res.send('Removed from favorites');
  });
});



//adding to favourites

app.post('/favorite_songs', (req, res) => {
  const { user_id, song_id, title, thumbnail, music_file } = req.body;
  console.log('User ID:', user_id); 
  db.query('INSERT INTO favorite_songs (user_id, song_id, title, thumbnail, music_file) VALUES (?, ?, ?, ?, ?)', [user_id, song_id, title, thumbnail, music_file], (err, result) => {
    if (err) {
      console.error('Error creating favorite song:', err);
      res.status(500).send('Error creating favorite song');
      return;
    }
    res.send('Added to Favorites Successfully');
  });
});




// Get favorite songs for a specific user
app.get('/favorite_songs/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM favorite_songs WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Failed to fetch favorite songs:', err);
      res.status(500).json({ error: 'Failed to fetch favorite songs' });
      return;
    }
    res.json(results);
  });
});





// Delete a favorite song by song_id
app.delete('/favorite_songs/:song_id', (req, res) => {
  const { song_id } = req.params;
  db.query('DELETE FROM favorite_songs WHERE song_id = ?', [song_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to remove from favorites');
      return;
    }
    res.send('Removed from favorites');
  });
});



//reviews
app.post('/reviews', (req, res) => {
  const { stars, user_id, song_id } = req.body;
  db.query('INSERT INTO reviews (stars, user_id, song_id) VALUES (?, ?, ?)', [stars, user_id, song_id], (err, result) => {
    if (err) {
      console.error('Error creating review:', err);
      res.status(500).send('Error creating review');
      return;
    }
    res.send('Review added successfully');
  });
});

//connecting to a server
//starting a server using port
const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






