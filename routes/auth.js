const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const {writeRefreshToken, writeAccessToken} = require("../JWT/writeTokens");
const {generateRefreshToken, generateAccessToken} = require("../JWT/ganerationTokens");
const {User} = require("../database/models"); // Додаємо імпорт crypto

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
        // Генеруємо тимчасовий код авторизації
        const authCode = crypto.randomBytes(32).toString('hex');

        // Зберігаємо код та дані користувача (з коротким TTL)
        authorizationCodes.set(authCode, {
            user: req.user,
            createdAt: Date.now()
        });

        // Видаляємо код через 5 хвилин
        setTimeout(() => {
            authorizationCodes.delete(authCode);
        }, 5 * 60 * 1000);

        // Перенаправляємо на фронтенд з тимчасовим кодом
        res.redirect(`http://your-frontend-url/auth/callback?code=${authCode}`);
    }
);


router.post('/token', express.json(), async (req, res) => {
    const {code} = req.body;

    if (!code) {
        return res.status(400).json({error: 'Authorization code is required'});
    }

    const authData = authorizationCodes.get(code);

    if (!authData) {
        return res.status(400).json({error: 'Invalid or expired code'});
    }

    // Перевіряємо чи код не застарів (5 хвилин)
    if (Date.now() - authData.createdAt > 5 * 60 * 1000) {
        authorizationCodes.delete(code);
        return res.status(400).json({error: 'Code expired'});
    }
    const finalUSer = await User.findOne(
        {
            where: {
                email: authData.user.email
            }
        }
    )

    // Видаляємо використаний код
    authorizationCodes.delete(code);


    // Генеруємо JWT токен

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


    // Відправляємо токен у відповіді
    res.json({tokens});
});

module.exports = router;
