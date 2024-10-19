const Feedback = require('../models/Feedback');

// Function to create feedback
const createFeedback = async (feedbackData) => {
    const feedback = new Feedback(feedbackData);
    try {
        return await feedback.save();
    } catch (error) {
        throw new Error('Error saving feedback: ' + error.message);
    }
};

// Function to retrieve all feedback
const getAllFeedbacks = async () => {
    try {
        return await Feedback.find();
    } catch (error) {
        throw new Error('Error fetching feedbacks: ' + error.message);
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks
};
