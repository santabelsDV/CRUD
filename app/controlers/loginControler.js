const {User} = require('../models');
const {generateAccessToken, generateRefreshToken} = require('../service/JWT/ganerationTokens')
const {writeRefreshToken, writeAccessToken} = require('../service/JWT/writeTokens')
const jwt = require("jsonwebtoken");
const {registrationNotificationByEmail} = require("../service/gmailBot/transporter");
const {Op} = require('sequelize');
const {validateData} = require("../service/validation/validationScheme");

const authorizationCodes = new Map();

async function login(req, res) {
    const {login, password} = req.body;

    const keyInReq = Object.keys(req.body);

    const validationResult = validateData(req.body, keyInReq);

    if (validationResult !== 'Validation passed') {
        return res.status(400).send(validationResult);
    }

    let user;

    try {
        user = await User.findOne({
            where: {
                password: password,
                login: login,
            }
        });

        if (!user || user.status === false) {
            return res.status(401).json({message: 'Invalid login or password or user is not active (activate by code in email)'});
        }

        const refreshToken = await generateRefreshToken(user);
        const accessToken = await generateAccessToken(user);

        await writeRefreshToken(user.id, refreshToken);
        await writeAccessToken(user.id, accessToken);

        res.json({
            refreshToken,
            accessToken
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('Login error');
    }
}

async function refresh(req, res) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({message: 'User not found'});
        }

        const accessToken = await generateAccessToken(user);
        await writeAccessToken(user.id, accessToken);

        res.json({accessToken});
    } catch (error) {
        res.status(400).json({message: 'Invalid token requires logging in'});
    }
}

async function registration(req, res) {

    const {login, email, password} = req.body;

    const keyInReq = Object.keys(req.body);

    const validationResult = validateData(req.body, keyInReq);

    if (validationResult !== 'Validation passed') {
        return res.status(400).send(validationResult);
    }

    let existingUser;

    try {
        existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email: email},
                    {login: login}
                ]
            }
        });

    } catch (e) {
        console.log(e);
    }

    if (existingUser) {
        return res.status(400).json({message: 'Such mail already exists or such login already exists'});
    }

    let randomCode = Math.floor(Math.random() * 1000000);

    if (authorizationCodes.has(randomCode)) {
       while (authorizationCodes.has(randomCode)) {
           randomCode = Math.floor(Math.random() * 1000000);
       }
    }

    let personUser = {
        login: login,
        email: email,
        password: password,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: false,
        updatedCodeAt: new Date(),
    }
    authorizationCodes.set(randomCode, {
        user:personUser ,
        createdAt: Date.now()
    });

    setTimeout(() => {
        authorizationCodes.delete(randomCode);
        try {
            User.destroy(
                {
                    where: {
                        login: login
                    }
                }
            )
        } catch (e) {
            console.log(e);
        }
    }, 5 * 60 * 1000);

    User.create(
        personUser
    )

    try {
        registrationNotificationByEmail(email, randomCode);
    } catch (e) {
        console.log(e);
        res.status(500).send('Registration error is not the correct mail!!!');
    }

    return res.status(200).json({message: 'The code was successfully sent to the mail'});

}

async function checkCode(req, res) {

    const { code, firstName, lastName, login} = req.body;

    const keyInReq = Object.keys(req.body);

    const validationResult = validateData(req.body, keyInReq);

    if (validationResult !== 'Validation passed') {
        return res.status(400).send(validationResult);
    }

    const codeNumber = Number(code);
    const userDataInCode = authorizationCodes.get(codeNumber);

    if (!userDataInCode || Date.now() - userDataInCode.createdAt > 5 * 60 * 1000) {
        return res.status(400).json({ error: 'The code has expired or invalid code' });
    }

    authorizationCodes.delete(codeNumber);

    const user = await User.findOne({
        where: {
            login: login,
        }
    });

    if (!user || user.updatedCodeAt < new Date() - 5 * 60 * 1000) {
        return res.status(400).json({error: 'Invalid code'});
    }

    const finalUSer = {
        firstName: firstName || ' ',
        lastName: lastName || ' ',
        login: login,
        password: user.password,
        email: user.email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true
    }

    let updatedUser

    try {
        await User.update(finalUSer, {
            where: {login: login},
            returning: true
        });

        updatedUser = await User.findOne({
            where: {
                login: login
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Registration error');
    }

    let accessToken
    let refreshToken

    if (updatedUser) {
        const userId = updatedUser.id;
        accessToken = await generateAccessToken(finalUSer);
        refreshToken = await generateRefreshToken(finalUSer);
        await writeRefreshToken(userId, refreshToken);
        await writeAccessToken(userId, accessToken);
    }

    return res.status(200).json({
        message: 'The code has been confirmed',
        accessToken: accessToken,
        refreshToken: refreshToken

    });
}

module.exports = {login, refresh, registration, checkCode};