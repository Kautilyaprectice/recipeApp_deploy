const Collection = require('../models/collection');
const Recipe = require('../models/recipe');
const CollectionRecipe = require('../models/collectionRecipe');

exports.createCollection = async (req, res) => {
    const { name } = req.body;
    try {
        const collection = await Collection.create({
            name: name,
            userId: req.user.id
        });
        res.status(201).json(collection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json(collections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addRecipeToCollection = async (req, res) => {
    const { collectionId, recipeId } = req.body;
    try {
        if (!collectionId || !recipeId) {
            return res.status(400).json({ error: 'Collection ID and Recipe ID are required' });
        }

        const collection = await Collection.findByPk(collectionId);
        const recipe = await Recipe.findByPk(recipeId);

        if (!collection || !recipe) {
            return res.status(404).json({ error: 'Collection or Recipe not found' });
        }

        const collectionRecipe = await CollectionRecipe.create({
            collectionId,
            recipeId
        });

        res.status(201).json({ message: 'Recipe added to collection successfully', collectionRecipe });
    } catch (err) {
        console.error('Error adding recipe to collection:', err);
        res.status(500).json({ error: err.message });
    }
};


exports.getRecipesInCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.user.id;
        
        const collection = await Collection.findOne({
            where: {
                id: collectionId,
                userId: userId,
            },
            include: {
                model: Recipe,
            },
        });
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        res.status(200).json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.collectionRecipe = async (req, res, next) => {
    try {
        const { collectionId } = req.params;
        const { recipeId } = req.body;

        await CollectionRecipe.create({
            collectionId: collectionId,
            recipeId: recipeId
        });

        res.status(200).json({ message: 'Recipe added to collection successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding recipe to collection' });
    }
}