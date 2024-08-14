const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
const favoriteRoutes = require('./routes/favorites');
const collectionRoutes = require('./routes/collections');
const reviewAndRatingRoutes = require('./routes/rateAndReview');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const User = require('./models/user');
const Recipe = require('./models/recipe');
const Favorite = require('./models/favorite');
const Collection = require('./models/collection');
const CollectionRecipe = require('./models/collectionRecipe');
const RateAndReview = require('./models/ratingAndReview');
const Activity = require('./models/activity');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use('/', userRoutes);
app.use('/', recipeRoutes);
app.use('/', favoriteRoutes);
app.use('/', collectionRoutes);
app.use('/', reviewAndRatingRoutes);
app.use('/', adminRoutes);

Recipe.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Recipe);

User.hasMany(Favorite);
Favorite.belongsTo(User);

Recipe.hasMany(Favorite);
Favorite.belongsTo(Recipe);

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.belongsToMany(Recipe, { through: CollectionRecipe });
Recipe.belongsToMany(Collection, { through: CollectionRecipe });

User.hasMany(RateAndReview);
RateAndReview.belongsTo(User);

Recipe.hasMany(RateAndReview);
RateAndReview.belongsTo(Recipe);

User.hasMany(Activity);
Activity.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => console.error('Database sync error', err));