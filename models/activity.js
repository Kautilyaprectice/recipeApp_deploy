const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Activity = sequelize.define('activity', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    action: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    details: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    activityType: {  
        type: Sequelize.STRING,
        allowNull: false
    },
    recipeId: { 
        type: Sequelize.INTEGER
    },
    reviewId: {  
        type: Sequelize.INTEGER
    }
});

module.exports = Activity;