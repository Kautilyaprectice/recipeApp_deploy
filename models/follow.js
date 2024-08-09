const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Follow = sequelize.define('follow', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    followedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Follow;