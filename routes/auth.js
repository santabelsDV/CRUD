const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const {writeRefreshToken, writeAccessToken} = require("../JWT/writeTokens");
const {generateRefreshToken, generateAccessToken} = require("../JWT/ganerationTokens");
const {User} = require("../database/models");   

const authorizationCodes = new Map();

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);


router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const authCode = crypto.randomBytes(32).toString('hex');

        authorizationCodes.set(authCode, {
            user: req.user,
            createdAt: Date.now()
        });

        setTimeout(() => {
            authorizationCodes.delete(authCode);
        }, 5 * 60 * 1000);

        res.redirect(`http://your-frontend-url/auth/callback?code=${authCode}`);
    }
);


router.post('/token', express.json(), async (req, res) => {
    const {code} = req.body;

    if (!code) {
        return res.status(400).json({error: 'Потрібен код авторизації'});
    }

    const authData = authorizationCodes.get(code);

    if (!authData) {
        return res.status(400).json({error: 'Недійсний або прострочений код'});
    }

    if (Date.now() - authData.createdAt > 5 * 60 * 1000) {
        authorizationCodes.delete(code);
        return res.status(400).json({error: 'Термін дії коду закінчився'});
    }
    const finalUSer = await User.findOne(
        {
            where: {
                email: authData.user.email
            }
        }
    )

    authorizationCodes.delete(code);

    acsessToken = await generateAccessToken(finalUSer);
    refreshToken = await generateRefreshToken(finalUSer);
    await writeRefreshToken(finalUSer.id, refreshToken);
    await writeAccessToken(finalUSer.id, acsessToken);

    tokens = {
        Tokens:{
            acsessToken: acsessToken,
            refreshToken:refreshToken
        }
    }

    res.json({tokens});
});

module.exports = router;
