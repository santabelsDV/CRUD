const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({message: 'У доступі відмовлено. Токен не надано.'});
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(400).json({message: 'Недійсний токен'});
    }
};

module.exports = {verifyToken};
