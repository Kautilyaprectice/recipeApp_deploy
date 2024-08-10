const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/admin/users', adminController.getAllUsers);
router.post('/admin/users/:userId/ban', adminController.banUser);
router.post('/admin/users/:userId/approve', adminController.approveUser);
router.get('/admin/recipes', adminController.getAllRecipes);
router.delete('/admin/recipes/:recipeId', adminController.deleteRecipe);

module.exports = router;
