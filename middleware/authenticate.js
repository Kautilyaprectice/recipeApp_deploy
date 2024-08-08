const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: no token provided' });
        }

        const decodedToken = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6InJhbmRvbVVzZXIiLCJlbWFpbCI6InJhbmRvbUBleGFtcGxlLmNvbSIsImlhdCI6MTY5MTQ2MjEyMiwiZXhwIjoxNjkxNDY1NzIyfQ.gVWVt_aArXYAJEXMo4CL4JupFFNDKRt7x4uV8EFfgGo');
        console.log(decodedToken.userId);

        User.findByPk(decodedToken.userId)
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Authentication failed: user not found' });
                }
                req.user = user;
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Authentication failed: invalid token' });
    }
};

module.exports = { authenticate };