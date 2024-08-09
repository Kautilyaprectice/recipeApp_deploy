const RateAndReview = require('../models/ratingAndReview');
const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.getRecipeDetails = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const ratings = await RateAndReview.findAll({
            where: { recipeId },
            include: [{ model: User, attributes: ['name'] }]
        });

        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length || 0;

        const reviews = ratings.map(rating => ({
            userName: rating.user.name,
            text: rating.text,
            rating: rating.rating
        }));

        res.status(200).json({ averageRating, reviews });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe details', error });
    }
};

exports.rateRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value. Must be between 1 and 5.' });
        }

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const rateAndReview = await RateAndReview.findOne({ where: { userId, recipeId } });
        if (rateAndReview) {
            rateAndReview.rating = rating;
            await rateAndReview.save();
        } else {
            await RateAndReview.create({ rating, recipeId, userId });
        }

        res.status(201).json({ message: 'Recipe rated successfully.' });
    } catch (error) {
        console.error('Error in rateRecipe:', error);
        res.status(500).json({ message: 'Error rating recipe', error: error.message });
    }
};

exports.reviewRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Review text cannot be empty.' });
        }

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const rateAndReview = await RateAndReview.findOne({ where: { userId, recipeId } });
        if (rateAndReview) {
            rateAndReview.text = text;
            await rateAndReview.save();
        } else {
            await RateAndReview.create({ text, recipeId, userId });
        }

        res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error });
    }
};
