import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const bookSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  name: String,
  cover: String,
  authors: [String],
  url: String,
});

const Book = mongoose.model('Book', bookSchema);

// Save favorite book
router.post('/favorite', async (req, res) => {
  const { userId, book } = req.body;

  try {
    // Check if the book is already favorited by this user
    const existingFavorite = await Book.findOne({ userId, bookId: book.bookId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Book is already favorited' });
    }

    const newBook = new Book({
      userId,
      ...book,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's favorite books
router.get('/favorites/:userId', async (req, res) => {
  try {
    const books = await Book.find({ userId: req.params.userId });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/favorite/:bookId', async (req, res) => {
  const { userId } = req.body; // Assuming userId is passed in the body
  const { bookId } = req.params;

  try {
    const result = await Book.deleteOne({ userId, bookId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
