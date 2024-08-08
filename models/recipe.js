const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Recipe = sequelize.define('recipe', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ingredients: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    instructions: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    difficulty: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dietary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preparationTime: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Recipe;
