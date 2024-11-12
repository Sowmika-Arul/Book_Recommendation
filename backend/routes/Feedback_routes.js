import express from 'express';
import Feedback from '../models/Feedback.js';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
    const { bookTitle, author, rating, comments, reviewDate } = req.body; 

    const newFeedback = new Feedback({
        bookTitle,
        author,
        rating,
        comments,
        reviewDate 
    });

    try {
        const savedFeedback = await newFeedback.save();
        res.json(savedFeedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
