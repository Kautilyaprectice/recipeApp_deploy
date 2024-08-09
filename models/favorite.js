const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Favorite = sequelize.define('favorite', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Favorite;