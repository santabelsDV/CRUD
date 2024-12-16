const {User} = require('../database/models');
const { generateAccessToken ,generateRefreshToken}=require('../JWT/ganerationTokens')
const {writeRefreshToken, writeAccessToken}=require('../JWT/writeTokens')
const jwt = require("jsonwebtoken");

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
            return res.status(401).json({message: 'Недійсний логін або пароль'});
        }

        const refreshToken = await generateRefreshToken(user);
        const accessToken = await generateAccessToken(user);

        // Записуємо обидва токени
        await writeRefreshToken(user.id, refreshToken);
        await writeAccessToken(user.id, accessToken);

        res.json({
            refreshToken,
            accessToken
        });

    } catch (e) {
        console.log(e);
        res.status(500).send('Помилка входу');
    }
}

async function refresh(req, res) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Важливо: отримати user з бази за ID з токену
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({message: 'Користувач не знайдений'});
        }

        const accessToken = await generateAccessToken(user);
        await writeAccessToken(user.id, accessToken);

        res.json({ accessToken }); // Надсилаємо новий accessToken назад
    } catch (error) {
        res.status(400).json({message: 'Недійсний токен необхідно залогінитись'});
    }
}
module.exports = {login,refresh};