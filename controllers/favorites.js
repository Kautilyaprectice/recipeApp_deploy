const Favorite = require('../models/favorite');
const Recipe = require('../models/recipe');

exports.addFavorite = async (req, res) => {
    const { recipeId } = req.body;
    try {
        const favorite = await Favorite.create({
            userId: req.user.id,
            recipeId: recipeId
        });
        res.status(201).json(favorite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFavorite = async (req, res) => {
    const { recipeId } = req.params;
    try {
        const favorite = await Favorite.findOne({
            where: {
                userId: req.user.id,
                recipeId: recipeId
            }
        });
        if (favorite) {
            await favorite.destroy();
            res.status(200).json({ message: 'Recipe removed from favorites' });
        } else {
            res.status(404).json({ message: 'Favorite not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({
            where: { userId: req.user.id },
            include: [{ model: Recipe }]
        });
        res.status(200).json(favorites.map(favorite => favorite.recipe)); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};