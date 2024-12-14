

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
};

module.exports = { generateToken };
