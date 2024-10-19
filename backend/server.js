import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/Feedback_routes.js';


// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Access environment variables
const PORT = process.env.PORT || 5057;
const MONGO_URI = process.env.MONGODB_URL;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Use authentication routes
app.use('/api/auth', authRoutes); 
app.use('/api/feedback', feedbackRoutes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
