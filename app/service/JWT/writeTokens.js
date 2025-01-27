const jwt = require('jsonwebtoken');
require('dotenv').config();
const {User} = require('../../../database/models');

const writeRefreshToken =  (userId, refreshtoken) => {

    try {
        User.update({
            refreshToken: refreshtoken,
        }, {
            where: {id: userId},
        });

    } catch (e) {
        console.log(e);
        throw new Error("Помилка при оновленні токену");
    }

    return refreshtoken;
};

const writeAccessToken =  (userId, accesstoken) => {

    try {
        User.update({
            accessToken: accesstoken,
        }, {
            where: {id: userId},
        },{
            logging: false
        });

    } catch (e) {
        console.log(e);
        throw new Error("Помилка при оновленні токену");
    }

    return accesstoken;
};

module.exports = {writeRefreshToken, writeAccessToken};
