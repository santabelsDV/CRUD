
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {User} = require('../database/models');

const  generateAccessToken = async (user) => {


    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        email: user.email,
        rolle: user.rolle,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    return token;
};

const generateRefreshToken = async (user) => {


    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        email: user.email,
        rolle: user.rolle,
    }

    const refreshtoken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2d'});

    return refreshtoken;
};



const generateToken = async () => {
    const token = await generateAccessToken(1);
    console.log(token);
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    console.log(decoded);
};

generateToken();


module.exports = { generateAccessToken ,generateRefreshToken};
