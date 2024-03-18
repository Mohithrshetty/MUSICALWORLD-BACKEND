const multer = require('multer');

// Set up storage for uploaded files
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

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;