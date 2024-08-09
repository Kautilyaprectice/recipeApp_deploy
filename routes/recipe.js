const express = require('express');
const recipeController = require('../controllers/recipe');
const userAuthentication = require('../middleware/authenticate');
const router = express.Router();

router.post('/user/recipe', userAuthentication.authenticate, recipeController.createRecipe);
router.get('/recipes', recipeController.getAllRecipes);
router.get('/filtered/recipes', recipeController.getFilteredRecipes)
router.put('/recipes/:id', userAuthentication.authenticate, recipeController.updateRecipe);
router.delete('/recipes/:id', userAuthentication.authenticate, recipeController.deleteRecipe);
router.get('/recipes/:id', recipeController.getRecipeById);

module.exports = router;