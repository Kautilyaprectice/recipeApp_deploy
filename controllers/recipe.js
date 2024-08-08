const Recipe = require('../models/recipe');
const { Op } = require('sequelize');

exports.createRecipe = async (req, res, next) => {
    const { title, ingredients, instructions, imageUrl, difficulty, dietary, preparationTime } = req.body;
    try {
        const recipe = await Recipe.create({ 
            title, 
            ingredients, 
            instructions, 
            imageUrl, 
            difficulty,
            dietary,
            preparationTime,
            userId: req.user.id 
        });
        res.status(201).json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
};

exports.getFilteredRecipes = async (req, res, next) => {
    const { search, dietary, difficulty, time } = req.query;
    let queryConditions = {};
    if (search) {
        queryConditions.title = { [Op.like]: `%${search}%` };
    }
    if (dietary) {
        queryConditions.dietary = dietary;
    }
    if (difficulty) {
        queryConditions.difficulty = difficulty;
    }
    if (time) {
        switch (time) {
            case 'short':
                queryConditions.preparationTime = 'short';
                break;
            case 'medium':
                queryConditions.preparationTime = 'medium';
                break;
            case 'long':
                queryConditions.preparationTime = 'long';
                break;
        }
    }
    try {
        const recipes = await Recipe.findAll({
            where: queryConditions
        });
        res.json(recipes);
    } catch (error) {
        console.error('Error filtering recipes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions, imageUrl, difficulty, dietary, preparationTime } = req.body;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            if (recipe.userId !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this recipe' });
            }
            recipe.title = title;
            recipe.ingredients = ingredients;
            recipe.instructions = instructions;
            recipe.imageUrl = imageUrl;
            recipe.difficulty = difficulty;
            recipe.dietary = dietary;
            recipe.preparationTime = preparationTime;
            await recipe.save();
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            if (recipe.userId !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
            }
            await recipe.destroy();
            res.status(200).json({ message: 'Recipe deleted successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
