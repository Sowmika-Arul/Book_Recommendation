import express from 'express';
import User1 from '../models/User1.js';

const router = express.Router();

// Create or update user profile
router.post('/', async (req, res) => {
    const { userId, name, email, photo, favoriteBooks, favoriteGenres, favoriteAuthors, themes } = req.body;

    try {
        // Use findOneAndUpdate to either update the existing user or create a new one
        const user = await User1.findOneAndUpdate(
            { userId },
            { name, email, photo, favoriteBooks, favoriteGenres, favoriteAuthors, themes },
            { new: true, upsert: true } // upsert: true means create if not found
        );
        res.status(200).json(user); // Respond with the updated or created user
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any errors
    }
});

// Fetch user profile by userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    try {
        const user = await User1.findOne({ userId }); // Find user by userId
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // If no user found
        }
        res.status(200).json(user); // Respond with user data
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any errors
    }
});

export default router;
