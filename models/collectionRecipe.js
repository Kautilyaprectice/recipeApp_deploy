const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CollectionRecipe = sequelize.define('collection_recipe', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = CollectionRecipe;