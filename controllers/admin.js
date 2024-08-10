const User = require('../models/user');
const Recipe = require('../models/recipe');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.banUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.update({ isBanned: true }, { where: { id: userId } });
        res.status(200).json({ message: 'User banned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.update({ isApproved: true }, { where: { id: userId } });
        res.status(200).json({ message: 'User approved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['name'] 
            }
        });
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        await Recipe.destroy({ where: { id: recipeId } });
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
