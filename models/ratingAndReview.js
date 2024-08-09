const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const RateAndReview = sequelize.define('rating_review', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.TEXT
    }
});

module.exports = RateAndReview;