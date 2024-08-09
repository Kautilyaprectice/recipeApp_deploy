const User = require('../models/user');
const Recipe = require('../models/recipe');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Follow = require('../models/follow');
const Activity = require('../models/activity');

exports.createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ where: { email: email }});
        if(existingUser){
            return res.status(403).json({ error: 'User already exists'});
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            await User.create({ name, email, password: hash });
            res.status(201).json({ message: "Successfully created a new user"});
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

function  generateAccessToken(id){
    return jwt.sign({ userId: id}, process.env.USER_TOKEN);
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ where: {email}});
        if(!user){
            return res.status(404).json({ error: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ success: false, message: "Password is incorrect" });
        }

        res.status(200).json({ message: "Login successful" , token: generateAccessToken(user.id)});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserProfile = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        user.name = name;
        user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getContributedRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.findAll({ where: { userId: req.user.id } });
        res.status(200).json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFavoriteRecipes = async (req, res, next) => {
    
};

exports.getAllUsers = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            throw new Error('User not authenticated');
        }
        const loggedInUserId = req.user.id;
        const users = await User.findAll();
        const usersWithFollowStatus = await Promise.all(users.map(async (user) => {
            const isFollowing = await Follow.findOne({
                where: { followerId: loggedInUserId, followedId: user.id }
            });
            return {
                ...user.toJSON(),
                isFollowing: !!isFollowing
            };
        }));
        res.status(200).json(usersWithFollowStatus);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.followUser = async (req, res) => {
    const { followedId } = req.body;
    const userId = req.user.id;

    if (userId === followedId) {
        return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    try {
        const existingFollow = await Follow.findOne({ where: { followerId: userId, followedId } });
        if (existingFollow) {
            return res.status(400).json({ message: 'Already following this user.' });
        }

        await Follow.create({ followerId: userId, followedId });

        await Activity.create({
            userId: followedId,
            action: 'followed',
            details: `User ${userId} followed you.`,
            activityType: 'follow'
        });

        res.status(200).json({ message: 'User followed successfully.' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

exports.getActivityFeed = async (req, res) => {
    const userId = req.user.id;

    try {
        const follows = await Follow.findAll({ where: { followerId: userId } });
        const followedIds = follows.map(follow => follow.followedId);

        const activities = await Activity.findAll({
            where: { userId: followedIds },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'DESC']],
        });

        const mappedActivities = activities.map(activity => ({
            userName: activity.user.name,
            type: activity.action,
            description: activity.details,
            activityType: activity.activityType,
            recipeId: activity.recipeId,  
            reviewId: activity.reviewId   
        }));
        res.status(200).json(mappedActivities);
    } catch (error) {
        console.error('Error fetching activity feed:', error);
        res.status(500).json({ message: 'Error fetching activity feed', error: error.message });
    }
};