import express from 'express';
import User1 from '../models/User1.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, name, email, photo, bio, favoriteBooks, favoriteGenres, favoriteAuthors, themes } = req.body;

    try {
        const user = await User1.findOneAndUpdate(
            { userId },
            { 
                name, 
                email, 
                photo, 
                bio, 
                favoriteBooks, 
                favoriteGenres, 
                favoriteAuthors, 
                themes
            },
            { new: true, upsert: true } 
        );
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});


router.get('/:userId', async (req, res) => {
    const { userId } = req.params; 

    try {
        const user = await User1.findOne({ userId }); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

export default router;
