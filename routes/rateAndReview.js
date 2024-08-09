const express = require('express');
const rateAndReviewController = require('../controllers/rateAndReview');
const userAuthentication = require('../middleware/authenticate');
const router = express.Router();

router.get('/recipes/:recipeId/details', rateAndReviewController.getRecipeDetails);
router.post('/recipes/:recipeId/rate', userAuthentication.authenticate, rateAndReviewController.rateRecipe);
router.post('/recipes/:recipeId/review', userAuthentication.authenticate, rateAndReviewController.reviewRecipe);

module.exports = router;