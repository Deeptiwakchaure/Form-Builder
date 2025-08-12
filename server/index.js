require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const crypto = require('crypto');
const fs = require('fs');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('ERROR: MongoDB connection string not found in environment variables');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err);
      cb(null, buf.toString('hex') + path.extname(file.originalname));
    });
  }
});

const upload = multer({ storage });

// API Routes
app.get('/', (req, res) => {
  res.send('Form Builder API');
});

// Import routes
const formRoutes = require('./routes/forms');
const responseRoutes = require('./routes/responses');

// Use routes
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// Image upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  // Return the file path for the uploaded image
  res.json({ file: `/uploads/${req.file.filename}` });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Handle port conflicts
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use, trying another port...`);
    const newPort = parseInt(PORT) + 1;
    server.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
      // Update the .env file with the new port
      const fs = require('fs');
      const envFile = path.join(__dirname, '..', '.env');
      let envContent = fs.readFileSync(envFile, 'utf8');
      envContent = envContent.replace(/PORT=.*/, `PORT=${newPort}`);
      fs.writeFileSync(envFile, envContent);
    });
  } else {
    console.error('Server error:', error);
  }
});