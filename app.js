const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
require('dotenv').config();

const User = require('./models/user');
const Recipe = require('./models/recipe');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/', recipeRoutes);

Recipe.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Recipe);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => console.error('Database sync error', err));