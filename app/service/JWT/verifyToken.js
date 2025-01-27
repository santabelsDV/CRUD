const jwt = require('jsonwebtoken');
const {User} = require('../../../database/models');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({message: 'У доступі відмовлено. Токен не надано.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({message: 'Недійсний токен'});
    }
};

module.exports = {verifyToken};
