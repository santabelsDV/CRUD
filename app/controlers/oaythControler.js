const crypto = require('crypto');
const {User} = require("../../database/models");
const {generateAccessToken, generateRefreshToken} = require ("../service/JWT/ganerationTokens");
const {writeAccessToken, writeRefreshToken} = require("../service/JWT/writeTokens");

const authorizationCodes = new Map();


class  OauthController   {

    async callback(req, res) {
        try {
            const authCode = crypto.randomBytes(32).toString('hex');

            authorizationCodes.set(authCode, {
                user: req.user,
                createdAt: Date.now()
            });

            setTimeout(() => {
                authorizationCodes.delete(authCode);
            }, 5 * 60 * 1000);

            res.redirect(`http://your-frontend-url/auth/callback?code=${authCode}`);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Server error'});
        }
    }

    async checkCode(req, res) {

        try {
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
                        email: authData.user.email,
                    }
                }
            )

            authorizationCodes.delete(code);

            let acsessToken = await generateAccessToken(finalUSer);
            let refreshToken = await generateRefreshToken(finalUSer);
            await writeRefreshToken(finalUSer.id, refreshToken);
            await writeAccessToken(finalUSer.id, acsessToken);

            res.json(
                {
                    Tokens: {
                    acsessToken: acsessToken,
                    refreshToken: refreshToken
                }
            });
        } catch (e) {
            console.log(e);
    res.status(500).json({message: 'Server error'});
        }
    }
}

module.exports = new OauthController();