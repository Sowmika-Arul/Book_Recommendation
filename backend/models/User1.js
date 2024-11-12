import mongoose from 'mongoose';

// User1 schema
const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String },
    bio: { type: String }, 
    favoriteBooks: { type: [String] },
    favoriteGenres: { type: [String] },
    favoriteAuthors: { type: [String] },
    themes: { type: [String] }
});

const User1 = mongoose.model('User1', userSchema);

export default User1;
