const express = require('express');
const userController = require('../controllers/user');
const userAuthentication = require('../middleware/authenticate');
const router = express.Router();

router.post('/user/signup', userController.createUser);
router.post('/user/login', userController.loginUser);
router.get('/user/profile', userAuthentication.authenticate, userController.getUserProfile);
router.put('/user/profile', userAuthentication.authenticate, userController.updateUserProfile);
router.get('/user/profile/contributed', userAuthentication.authenticate, userController.getContributedRecipes);
router.get('/user/profile/favorites', userAuthentication.authenticate, userController.getFavoriteRecipes);
router.get('/users/allUsers', userAuthentication.authenticate, userController.getAllUsers);
router.post('/user/follow', userAuthentication.authenticate, userController.followUser);
router.get('/user/activity-feed', userAuthentication.authenticate, userController.getActivityFeed);
router.get('/user/isAdmin', userAuthentication.authenticate, userController.getIsAdmin);

module.exports = router;