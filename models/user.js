const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
    },
    isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isBanned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;