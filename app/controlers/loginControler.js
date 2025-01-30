const {User} = require('../../database/models');
const {generateAccessToken, generateRefreshToken} = require('../service/JWT/ganerationTokens')
const {writeRefreshToken, writeAccessToken} = require('../service/JWT/writeTokens')
const jwt = require("jsonwebtoken");
const {RegistrationCache} = require("../../database/models");
const {registationMessageInEmail} = require("../service/gmailBot/transporter");

async function login(req, res) {
    const {login, password} = req.body;
    let user;

    try {
        user = await User.findOne({
            where: {
                password: password,
                login: login,
            }
        });

        if (!user) {
            return res.status(401).json({message: 'Invalid login or password'});
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

    let useremail;
    let userLogin;

    try {
        useremail = await User.findOne({
            where: {
                email: email,
            }
        });
        userLogin = await User.findOne({
            where: {
                login: login,
            }
        });


    } catch (e) {
        console.log(e);
    }

    if (useremail) {
        return res.status(400).json({message: 'Such mail already exists'});
    }
    if (userLogin) {
        return res.status(400).json({message: 'This login already exists'});
    }


    let randomCode = Math.floor(Math.random() * 1000000);

    RegistrationCache.create(
        {
            email: email,
            code: randomCode,
            login: login,
            password: password
        }
    )

    try {
        registationMessageInEmail(email, randomCode);
    } catch (e) {
        console.log(e);
        res.status(500).send('Registration error is not the correct mail!!!');
    }

    return res.status(200).json({message: 'The code was successfully sent to the mail'});

}

async function checkCode(req, res) {

    const {email, code, password, firstName, lastName, login} = req.body;

    const user = await RegistrationCache.findOne({
        where: {
            email: email,
            code: code,
            login: login,
            password: password
        }
    });

    if (!user) {
        return res.status(400).json({message: 'Invalid code'});

    }
    if (!firstName || !lastName || !login || !password) {
        return res.status(400).json({message: 'All fields must be filled in'});
    }

    RegistrationCache.destroy({
        where: {
            email: email,
        }
    })

    const finalUSer = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password,
        email: email,
        rolle: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
    }


    const newUser = await User.create(finalUSer, {
        logging: false
    });

    await writeRefreshToken(newUser.id, await generateRefreshToken(finalUSer));
    await writeAccessToken(newUser.id, await generateAccessToken(finalUSer));


    return res.status(200).json({message: 'The code has been confirmed'});
}

module.exports = {login, refresh, registration, checkCode};