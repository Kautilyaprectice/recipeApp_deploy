const express = require('express');
const favoritesController = require('../controllers/favorites');
const userAuthentication = require('../middleware/authenticate');
const router = express.Router();

router.post('/user/favorites', userAuthentication.authenticate, favoritesController.addFavorite);
router.delete('/user/favorites/:recipeId', userAuthentication.authenticate, favoritesController.removeFavorite);
router.get('/user/favorites', userAuthentication.authenticate, favoritesController.getFavorites);

module.exports = router;