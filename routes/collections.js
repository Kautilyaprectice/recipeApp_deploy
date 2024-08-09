const express = require('express');
const collectionsController = require('../controllers/collections');
const userAuthentication = require('../middleware/authenticate');
const router = express.Router();

router.post('/user/collections', userAuthentication.authenticate, collectionsController.createCollection);
router.get('/user/collections', userAuthentication.authenticate, collectionsController.getCollections);
router.post('/user/collections/recipes', userAuthentication.authenticate, collectionsController.addRecipeToCollection);
router.get('/user/collections/:collectionId', userAuthentication.authenticate, collectionsController.getRecipesInCollection);
router.post('/user/collections/:collectionId/recipes', userAuthentication.authenticate, collectionsController.collectionRecipe);

module.exports = router;