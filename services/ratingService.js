const mongoose = require('mongoose');

// Rating schema for app reviews
const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

// Save user rating to database
const saveRating = async (userId, rating, comment) => {
  const newRating = new Rating({
    userId: userId || null,
    rating,
    comment: comment || ''
  });

  await newRating.save();
  return newRating;
};

// Get average rating and total count
const getRatingStats = async () => {
  const stats = await Rating.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  return stats[0] || { averageRating: 0, totalRatings: 0 };
};

module.exports = {
  saveRating,
  getRatingStats
};