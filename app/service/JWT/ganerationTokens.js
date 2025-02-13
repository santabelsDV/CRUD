const jwt = require('jsonwebtoken');
require('dotenv').config();

const  generateAccessToken = async (user) => {


    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        email: user.email,
        role: user.rolle,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); // get access token
};

const generateRefreshToken = async (user) => {


    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        email: user.email,
        role: user.rolle,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2d'}); // get refresh token
};

// check token works and example
// const generateToken = async () => {
//     const token = await generateAccessToken(1);
//     console.log(token);
//     const decoded = jwt.decode(token, process.env.JWT_SECRET);
//     console.log(decoded);
// };

module.exports = { generateAccessToken ,generateRefreshToken};
