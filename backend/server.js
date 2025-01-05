import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/Feedback_routes.js';
import userRoutes from './routes/User1.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import multer from 'multer';
import fetch from 'node-fetch';

dotenv.config();

// Ensure required environment variables are set
if (!process.env.MONGODB_URL) {
  console.error('MONGODB_URL is not defined in the environment variables.');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5057;
const MONGO_URI = process.env.MONGODB_URL;

// CORS Configuration
const allowedOrigins = [
  'https://book-recommendation-frontend.onrender.com', // Deployed frontend URL
  'http://localhost:3000',                            // Localhost React app
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

// Middleware for parsing request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
    process.exit(1); // Exit on critical error
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', userRoutes);
app.use('/favorites', favoriteRoutes);

// Audiobooks API with Pagination
app.get('/audiobooks', async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query; // Updated default limit to 20
  try {
    const url = `https://librivox.org/api/feed/audiobooks/?title=${encodeURIComponent(search)}&limit=${limit}&page=${page}&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Librivox API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data); // Send API data to the client
  } catch (error) {
    console.error('Error fetching data from Librivox API:', error.message);
    res.status(500).json({ error: 'Failed to fetch audiobooks data' });
  }
});

// Handle 404 Errors for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
